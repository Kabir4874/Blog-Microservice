import axios from "axios";
import { redis } from "../server.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const getAllBlogs = TryCatch(async (req, res) => {
  const { searchQuery = "", category = "" } = req.query;

  const cacheKey = `blogs:${searchQuery}:${category}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  let blogs;

  if (searchQuery && category) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE (title ILIKE ${"%" + searchQuery + "%"} 
             OR description ILIKE ${"%" + searchQuery + "%"}
             OR blog_content ILIKE ${"%" + searchQuery + "%"})
        AND category = ${category}
      ORDER BY created_at DESC
    `;
  } else if (searchQuery) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE title ILIKE ${"%" + searchQuery + "%"} 
         OR description ILIKE ${"%" + searchQuery + "%"}
         OR blog_content ILIKE ${"%" + searchQuery + "%"}
      ORDER BY created_at DESC
    `;
  } else if (category) {
    blogs = await sql`
      SELECT * FROM blogs 
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;
  } else {
    blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
  }

  await redis.set(cacheKey, JSON.stringify(blogs), { EX: 3600 });

  return res.status(200).json({
    blogs,
  });
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blogId = req.params.id;
  const cacheKey = `blog:${blogId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }
  const blog = await sql`SELECT * FROM blogs WHERE id=${blogId}`;

  if (!blog.length) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }
  const response = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0]?.author}`
  );

  const responseData = {
    blog: blog[0],
    author: response?.data,
  };
  await redis.set(cacheKey, JSON.stringify(responseData), { EX: 3600 });
  return res.status(200).json(responseData);
});
