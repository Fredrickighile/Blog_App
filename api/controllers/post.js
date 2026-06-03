import { db } from "../db.js";
import jwt from "jsonwebtoken";

// ✅ Helper: extract and verify token
const verifyToken = (req, res, callback) => {
  let token = req.cookies.access_token;
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader && authHeader.split(" ")[1];
  }
  if (!token) return res.status(401).json("Not authenticated!");

  // ✅ FIX: Use JWT_SECRET from environment variable, not hardcoded "jwtKey"
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    callback(userInfo);
  });
};

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT id, title, description, img, category, date, uid FROM posts WHERE category = $1"
    : "SELECT id, title, description, img, category, date, uid FROM posts";

  const values = req.query.cat ? [req.query.cat] : [];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json("Something went wrong"); // ✅ FIX: no raw DB error
    const posts = data.rows.map((post) => ({
      ...post,
      desc: post.description,
    }));
    return res.status(200).json(posts);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, p.title, p.description, p.img, u.img AS userImg, p.date, p.category, u.username FROM posts p JOIN users u ON u.id = p.uid WHERE p.id = $1";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json("Something went wrong");
    if (data.rows.length === 0) return res.status(404).json("Post not found!");
    const post = { ...data.rows[0], desc: data.rows[0].description };
    return res.status(200).json(post);
  });
};

export const addPost = (req, res) => {
  verifyToken(req, res, (userInfo) => {
    const { title, desc, img, cat, date } = req.body;

    // ✅ FIX: Validate required fields
    if (!title || !desc) {
      return res.status(400).json("Title and content are required");
    }

    const q =
      "INSERT INTO posts(title, description, img, category, date, uid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

    const values = [
      title,
      desc,
      img,
      cat,
      date || new Date().toISOString(),
      userInfo.id,
    ];

    db.query(q, values, (err) => {
      if (err) return res.status(500).json("Something went wrong");
      return res.status(201).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  verifyToken(req, res, (userInfo) => {
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = $1 AND uid = $2";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json("Something went wrong");
      if (data.rowCount === 0)
        return res.status(403).json("You can only delete your own posts!");
      return res.json("Post has been deleted");
    });
  });
};

export const updatePost = (req, res) => {
  verifyToken(req, res, (userInfo) => {
    const postId = req.params.id;
    const { title, desc, img, cat } = req.body;

    // ✅ FIX: Validate required fields
    if (!title || !desc) {
      return res.status(400).json("Title and content are required");
    }

    const checkQuery = "SELECT * FROM posts WHERE id = $1 AND uid = $2";

    db.query(checkQuery, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json("Something went wrong");
      if (data.rows.length === 0)
        return res.status(403).json("You can only update your own posts!");

      const q =
        "UPDATE posts SET title = $1, description = $2, img = $3, category = $4 WHERE id = $5 AND uid = $6";

      db.query(q, [title, desc, img, cat, postId, userInfo.id], (err) => {
        if (err) return res.status(500).json("Something went wrong");
        return res.json("Post has been updated.");
      });
    });
  });
};
