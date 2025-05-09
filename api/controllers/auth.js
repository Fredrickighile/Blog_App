// controllers/authController.js
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register controller
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json("Username, email and password are required");
  }

  try {
    // Check if user exists
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await db.query(checkQuery, [email, username]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json("User already exists!");
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert new user
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const insertResult = await db.query(insertQuery, [username, email, hash]);

    // Remove password from response
    const { password: _, ...user } = insertResult.rows[0];

    return res.status(201).json(user);
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json("Something went wrong during registration");
  }
};
export const login = (req, res) => {
  // CHECK USER
  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);

    // Check if the user exists in the database
    if (data.rows.length === 0) return res.status(404).json("User not found");

    const user = data.rows[0]; // Safe access to first user
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password");

    // Sign the JWT token
    const token = jwt.sign({ id: user.id }, "jwtKey");

    const { password, ...other } = user; // Remove password from response
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
