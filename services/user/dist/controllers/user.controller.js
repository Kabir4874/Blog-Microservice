import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TryCatch from "../utils/TryCatch.js";
import getBuffer from "../utils/dataUri.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.status(200).json({
        message: "Login success",
        token,
        user,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.status(200).json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400).json({
            message: "No user with this id",
        });
    }
    res.status(200).json(user);
});
export const updateUser = TryCatch(async (req, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, {
        name,
        instagram,
        facebook,
        linkedin,
        bio,
    }, { new: true });
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.status(200).json({
        message: "User Updated",
        token,
        user,
    });
});
export const updateProfilePic = TryCatch(async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file to upload" });
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            return res.status(400).json({ message: "Failed to generate buffer" });
        }
        const extractPublicId = (url) => {
            if (!url)
                return null;
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+(?:\?.*)?$/i);
            return match?.[1] ?? null;
        };
        if (existingUser.image) {
            const publicId = extractPublicId(existingUser.image);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                }
                catch (e) {
                    console.warn("Cloudinary destroy failed for", publicId, e);
                }
            }
        }
        const uploadResult = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blog-microservice",
        });
        existingUser.image = uploadResult.secure_url;
        const user = await existingUser.save();
        const token = jwt.sign({ user }, process.env.JWT_SEC, {
            expiresIn: "5d",
        });
        return res.status(200).json({
            message: "User Profile Picture Updated",
            token,
            user,
        });
    }
    catch (err) {
        console.error("updateProfilePic error:", err);
        return res
            .status(500)
            .json({ message: "Failed to update profile picture" });
    }
});
//# sourceMappingURL=user.controller.js.map