import amqp from "amqplib";
import dotenv from "dotenv";
import { redis } from "../server.js";
import { sql } from "./db.js";

dotenv.config();

let channel: amqp.Channel;
interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: process.env.RABBITMQ_PROTOCOL || "amqp",
      hostname: process.env.RABBITMQ_HOST || "localhost",
      port: parseInt(process.env.RABBITMQ_PORT || "5672"),
      username: process.env.RABBITMQ_USERNAME || "guest",
      password: process.env.RABBITMQ_PASSWORD || "guest",
      vhost: process.env.RABBITMQ_VHOST || "/",
    });

    channel = await connection.createChannel();

    const queueName = "cache-invalidation";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Blog Service cache consumer started");
    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(
            msg.content.toString()
          ) as CacheInvalidationMessage;
          console.log(
            "📩 Blog service received cache invalidation message",
            content
          );

          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redis.keys(pattern);
              if (keys.length > 0) {
                await redis.del(keys);
                console.log(
                  `🗑️ Blog service invalidated ${keys.length} cache keys matching: ${pattern}`
                );
                const searchQuery = "";
                const category = "";
                const cacheKey = `blogs:${searchQuery}:${category}`;

                const blogs =
                  await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
                await redis.set(cacheKey, JSON.stringify(blogs), { EX: 3600 });

                console.log("🔄️ Cache rebuilt with key: ", cacheKey);
              }
            }
          }
          channel.ack(msg);
        } catch (error) {
          console.error(
            "❌ Error processing cache invalidation in blog service: ",
            error
          );
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("❌ Failed to start RabbitMQ Consumer", error);
  }
};
