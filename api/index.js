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
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ FIX 1: Security Headers Middleware (fixes CSP, Clickjacking, HSTS, X-Content-Type, Cache-Control)
app.use((req, res, next) => {
  // Fix: Content Security Policy (CSP) Header Not Set
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://res.cloudinary.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https://res.cloudinary.com; " +
      "connect-src 'self' https://res.cloudinary.com; " +
      "frame-ancestors 'none';",
  );

  // Fix: Missing Anti-Clickjacking Header
  res.setHeader("X-Frame-Options", "DENY");

  // Fix: Strict-Transport-Security Header Not Set
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  // Fix: X-Content-Type-Options Header Missing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Fix: Re-examine Cache-Control Directives
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Fix: Cross-Domain Misconfiguration
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  // Bonus: Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Bonus: Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  next();
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ FIX 2: Strict CORS - only allow known frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://blog-app-sable-three.vercel.app",
        "https://blog-app-5471.vercel.app",
        "https://fred-blog.vercel.app",
        "https://fredig.vercel.app",
      ];
      // Allow requests with no origin (e.g. mobile apps, curl) only in dev
      if (!origin && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ FIX 3: Root route — no version/info leakage
app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// ✅ FIX 4: REMOVED /api/debug endpoint (was leaking environment config info)
// ✅ FIX 5: REMOVED /api/test-auth endpoint (was leaking auth/cookie details)

// Configure multer — restrict file types and size
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload endpoint — authenticated only
app.post("/api/upload", upload.single("file"), async function (req, res) {
  // ✅ FIX 6: Require auth before uploading
  let token = req.cookies.access_token;
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader && authHeader.split(" ")[1];
  }
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "blog_uploads" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      res.status(200).json(result.secure_url);
    } catch (error) {
      res.status(500).json({ error: "Upload failed" }); // ✅ No error details leaked
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// ✅ FIX 7: Global error handler — never leak stack traces
app.use((err, req, res, next) => {
  console.error(err); // log internally only
  res.status(err.status || 500).json({ error: "Something went wrong" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(8000, () => {
    console.log("Server connected on port 8000");
  });
}

export default app;
