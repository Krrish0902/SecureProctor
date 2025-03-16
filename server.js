import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studentAuthRoutes from "./routes/studentAuthRoutes.js"; // Student authentication routes
//import studentRoutes from "./routes/studentAuthRoutes.js"; // Student routes
//import studentAuthRoutes from "./routes/studentAuthRoutes.js"; // Student authentication routes

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/students/auth", studentAuthRoutes); // Authentication routes for students

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
