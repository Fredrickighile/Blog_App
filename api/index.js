import express from "express";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Enable CORS for all origins (or configure as needed)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-app-sable-three.vercel.app",
      "https://blog-app-5471.vercel.app", // Add your frontend domain
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Add a root route handler
app.get("/", (req, res) => {
  res.status(200).json({ message: "Blog API server is running" });
});

// DEBUG ENDPOINT - Put it here
app.get("/api/debug", (req, res) => {
  res.json({
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Not Set",
  });
});

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Updated upload endpoint with Cloudinary
app.post("/api/upload", upload.single("file"), async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto", // Automatically detect file type
            folder: "blog_uploads", // Optional: organize uploads in folders
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Return the Cloudinary URL
    res.status(200).json({
      filename: result.public_id,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(8000, () => {
    console.log("Server connected on port 8000");
  });
}

// For Vercel deployment
export default app;
