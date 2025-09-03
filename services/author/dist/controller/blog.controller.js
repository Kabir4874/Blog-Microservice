import { v2 as cloudinary } from "cloudinary";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitmq.js";
import TryCatch from "../utils/TryCatch.js";
export const createBlog = TryCatch(async (req, res) => {
    const { title, description, blog_content, category } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "No file to upload",
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        return res.status(400).json({
            message: "Failed to generate buffer",
        });
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blog-microservice",
    });
    const result = await sql `INSERT INTO blogs (title,description,image,blog_content,category, author) VALUES(
    ${title},${description},${cloud.secure_url},${blog_content},${category},${req.user?._id}
  ) RETURNING *`;
    await invalidateCacheJob(["blogs:*"]);
    return res.status(200).json({
        message: "Blog created successfully",
        blog: result[0],
    });
});
export const updateBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { title, description, blog_content, category } = req.body;
    const file = req.file;
    const blog = await sql `SELECT * FROM blogs WHERE id=${id}`;
    if (!blog.length) {
        return res.status(404).json({
            message: "Blog not found",
        });
    }
    if (blog[0]?.author !== req.user?._id) {
        return res.status(401).json({
            message: "You are not author of this blog",
        });
    }
    let imageUrl = blog[0]?.image;
    if (file) {
        const existingImageUrl = imageUrl;
        if (existingImageUrl && existingImageUrl.includes("cloudinary.com")) {
            const urlParts = existingImageUrl.split("/");
            const publicIdWithExtension = urlParts.slice(-2).join("/");
            const publicId = publicIdWithExtension.split(".")[0];
            await cloudinary.uploader.destroy(publicId).catch((error) => {
                console.error("Error deleting old image from Cloudinary:", error);
            });
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            return res.status(400).json({
                message: "Failed to generate buffer",
            });
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blog-microservice",
        });
        imageUrl = cloud.secure_url;
    }
    const updatedBlog = await sql `UPDATE blogs SET 
    title= ${title || blog[0]?.title},
    description= ${description || blog[0]?.description},
    image=${imageUrl},
    blog_content= ${blog_content || blog[0]?.blog_content},
    category= ${category || blog[0]?.category}
    WHERE id = ${id} RETURNING *;
  `;
    await invalidateCacheJob(["blogs:*", `blog:${id}`]);
    return res.status(200).json({
        message: "Blog Updated successfully",
        blog: updatedBlog[0],
    });
});
export const deleteBlog = TryCatch(async (req, res) => {
    const id = req.params.id;
    const blog = await sql `SELECT * FROM blogs WHERE id=${id}`;
    if (!blog.length) {
        return res.status(404).json({
            message: "Blog not found",
        });
    }
    if (blog[0]?.author !== req.user?._id) {
        return res.status(401).json({
            message: "You are not author of this blog",
        });
    }
    const existingImageUrl = blog[0].image;
    if (existingImageUrl && existingImageUrl.includes("cloudinary.com")) {
        const urlParts = existingImageUrl.split("/");
        const publicIdWithExtension = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExtension.split(".")[0];
        await cloudinary.uploader.destroy(publicId).catch((error) => {
            console.error("Error deleting old image from Cloudinary:", error);
        });
    }
    await sql `DELETE FROM saved_blogs WHERE blog_id=${id}`;
    await sql `DELETE FROM comments WHERE blog_id=${id}`;
    await sql `DELETE FROM blogs WHERE id=${id}`;
    await invalidateCacheJob(["blogs:*", `blog:${id}`]);
    return res.status(200).json({
        message: "Blog deleted successfully",
    });
});
//# sourceMappingURL=blog.controller.js.map