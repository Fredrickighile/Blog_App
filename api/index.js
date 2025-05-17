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
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all origins (or configure as needed)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-app-sable-three.vercel.app",
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

// Serve uploaded files statically
app.use(
  "/upload",
  express.static(path.join(__dirname, "../client/public/upload"))
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
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
