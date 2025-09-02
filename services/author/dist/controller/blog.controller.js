import { v2 as cloudinary } from "cloudinary";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
export const createBlog = TryCatch(async (req, res) => {
    const { title, description, blog_content, category } = req.body;
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed to generate buffer",
        });
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blog-microservice",
    });
    const result = await sql `INSERT INTO blogs (title,description,image,blog_content,category, author) VALUES(
    ${title},${description},${cloud.secure_url},${blog_content},${category},${req.user?._id}
  ) RETURNING *`;
    res.status(200).json({
        message: "Blog created successfully",
        blog: result[0],
    });
});
//# sourceMappingURL=blog.controller.js.map