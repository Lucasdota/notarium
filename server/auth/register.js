import { Pool } from "../postgres";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  if (req.method === "POST") {
    const { nome, email, password } = req.body;

    try {
      // Check if the user already exists
      const userExistQuery = "SELECT * FROM users WHERE email = $1";
      const userExistValues = [email];
      const userExistResult = await Pool.query(userExistQuery, userExistValues);

      if (userExistResult.rowCount > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const insertUserQuery =
        "INSERT INTO users (email, password, nome) VALUES ($1, $2, $3)";
      const insertUserValues = [uuidv4(), email, hashedPassword, nome];
      await Pool.query(insertUserQuery, insertUserValues);

      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res
        .status(201)
        .json({ message: "User registered successfully", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
};

export default register;
