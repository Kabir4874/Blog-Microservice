import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.route.js";
import connectDB from "./utils/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
connectDB();

app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
