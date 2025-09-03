import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createClient } from "redis";
import blogRoutes from "./routes/blog.route.js";
import { startCacheConsumer } from "./utils/consumer.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5002;
startCacheConsumer();
export const redis = createClient({
    url: process.env.REDIS_URL,
});
redis
    .connect()
    .then(() => console.log("Connected to redis"))
    .catch(() => console.error("Error on redis"));
app.use("/api/v1", blogRoutes);
app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map