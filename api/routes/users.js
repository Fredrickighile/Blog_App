import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

router.get("/me", (req, res) => {
  let token = req.cookies.access_token;

  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader && authHeader.split(" ")[1];
  }

  if (!token) return res.status(401).json("Not authenticated!");

  // ✅ FIX: Use JWT_SECRET from environment variable
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT id, username, email, img FROM users WHERE id = $1";

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json("Something went wrong"); // ✅ FIX: no raw DB error
      if (data.rows.length === 0) return res.status(404).json("User not found");
      return res.status(200).json(data.rows[0]);
    });
  });
});

export default router;
