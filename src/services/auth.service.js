import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handleServiceError } from "../helpers/handleServiceError.js";


export const registerUser = async (username, email, password) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    if (!result?.rows?.length) {
      throw new Error("Failed to create user");
    }

    return result.rows[0];

  } catch (err) {
    handleServiceError(err, "Registration failed");
  }
};




export const loginUser = async (email, password) => {
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      throw new Error("No user found");
    }

    const dbUser = user.rows[0];

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return {
      token,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
      },
    };
  } catch (err) {
    handleServiceError(err, "Login failed");
  }
};

export const logoutUser = async () => {
  try {
    return { message: "Logged out successfully" };

  } catch (err) {
    handleServiceError(err, "Logout failed");
  }
};

