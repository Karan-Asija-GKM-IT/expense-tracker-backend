import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerService = async (username, email, password) => {

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query("INSERT INTO users (username, email, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, username, email", [username, email, hashedPassword]);

    return result.rows[0];
};


export const loginService = async (email, password) => {
  
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
        throw new Error("No user found");
    }
    const dbUser = user.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    //Generate JWT
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
};

