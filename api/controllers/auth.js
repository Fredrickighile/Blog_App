import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json("Username, email and password are required");
  }

  // ✅ FIX: Basic input validation
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json("Username must be between 3 and 30 characters");
  }
  if (password.length < 8) {
    return res.status(400).json("Password must be at least 8 characters");
  }

  try {
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await db.query(checkQuery, [email, username]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json("User already exists!");
    }

    const salt = bcrypt.genSaltSync(12); // ✅ FIX: increased from 10 to 12 rounds
    const hash = bcrypt.hashSync(password, salt);

    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const insertResult = await db.query(insertQuery, [username, email, hash]);

    const { password: _, ...user } = insertResult.rows[0];
    return res.status(201).json(user);
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json("Something went wrong during registration");
  }
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json("Something went wrong"); // ✅ FIX: no raw error leakage

    // ✅ FIX: Generic message — don't reveal whether username or password was wrong
    if (data.rows.length === 0) {
      return res.status(401).json("Invalid credentials");
    }

    const user = data.rows[0];
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json("Invalid credentials"); // ✅ FIX: same message as above
    }

    // ✅ FIX: Use JWT_SECRET from environment, with expiry
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password, ...other } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ ...other, token });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
