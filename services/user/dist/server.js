import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.route.js";
import connectDB from "./utils/db.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json());
app.use(cors());
connectDB();
app.use("/api/v1", userRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map