import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
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
    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("RabbitMQ channel is not initialize");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const invalidateCacheJob = async (cacheKeys: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };
    await publishToQueue("cache-invalidation", message);
    console.log("✅ Cache invalidation job published to RabbitMQ");
  } catch (error) {
    console.error("❌ Failed to publish cache on RabbitMQ", error);
  }
};
