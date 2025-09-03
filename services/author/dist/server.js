import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import blogRoutes from "./routes/blog.route.js";
import { sql } from "./utils/db.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5001;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
connectRabbitMQ();
async function initDB() {
    try {
        await sql `
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blog_content TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await sql `
        CREATE TABLE IF NOT EXISTS comment(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blog_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await sql `
        CREATE TABLE IF NOT EXISTS saved_blogs(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            blog_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        console.log("Database Initialized Successfully");
    }
    catch (error) {
        console.log("Error InitDb: ", error);
    }
}
app.use("/api/v1", blogRoutes);
initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on: http://localhost:${port}`);
    });
});
//# sourceMappingURL=server.js.map