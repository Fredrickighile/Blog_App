import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  // Use explicit column names instead of * to ensure proper mapping
  const q = req.query.cat
    ? "SELECT id, title, description, img, category, date, uid FROM posts WHERE category = $1"
    : "SELECT id, title, description, img, category, date, uid FROM posts";

  const values = req.query.cat ? [req.query.cat] : [];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);

    // Map description to desc for frontend compatibility
    const posts = data.rows.map((post) => ({
      ...post,
      desc: post.description, // Add desc field that maps to description
    }));

    return res.status(200).json(posts);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, p.title, p.description, p.img, u.img AS userImg, p.date, p.category, u.username FROM posts p JOIN users u ON u.id = p.uid WHERE p.id = $1";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.rows.length === 0) {
      return res.status(404).json("Post not found!");
    }

    // Map description to desc for frontend compatibility
    const post = data.rows[0];
    post.desc = post.description; // Add desc field that maps to description

    return res.status(200).json(post);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { title, desc, img, cat, date } = req.body;

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

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(201).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "jwtKey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");

    const postId = req.params.id;
    // Fixed the SQL query and parameter passing
    const q = "DELETE FROM posts WHERE id = $1 AND uid = $2";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.rowCount === 0) {
        return res.status(403).json("You can only delete your own posts!");
      }

      return res.json("Post has been deleted");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const { title, desc, img, cat } = req.body;

    // First check if user owns the post
    const checkQuery = "SELECT * FROM posts WHERE id = $1 AND uid = $2";

    db.query(checkQuery, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.rows.length === 0) {
        return res.status(403).json("You can only update your own posts!");
      }

      // If user owns the post, proceed with update
      const q =
        "UPDATE posts SET title = $1, description = $2, img = $3, category = $4 WHERE id = $5 AND uid = $6";

      const values = [title, desc, img, cat, postId, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);

        return res.json("Post has been updated.");
      });
    });
  });
};
