import { Pool } from "../postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Check if the user exists
      const userExistQuery = "SELECT * FROM usuarios WHERE email = $1";
      const userExistValues = [email];
      const userExistResult = await Pool.query(userExistQuery, userExistValues);

      if (userExistResult.rowCount === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      // Compare the provided password with the stored hash
      const hashedPassword = userExistResult.rows[0].password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
};

export default login;
