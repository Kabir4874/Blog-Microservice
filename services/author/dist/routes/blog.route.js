import express from "express";
import { createBlog } from "../controller/blog.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
const router = express.Router();
router.post("/blog/new", isAuth, uploadFile, createBlog);
export default router;
//# sourceMappingURL=blog.route.js.map