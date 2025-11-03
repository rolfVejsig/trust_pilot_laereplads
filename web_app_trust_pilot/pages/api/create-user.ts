import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error("Missing required fields:", { username, email, password });
    return res.status(400).json({ message: "Missing required fields", received: { username, email, password } });
  }

  console.log("Request body is valid:", { username, email, password });

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "learepladsDB",
      port: 3306,
    });

    console.log("Connected to database");

    const query = `CALL InsertUser(?, ?, ?, ?)`;
    const values = [username, email, password, 1]; 

    console.log("Executing query:", query, values);

    const [result] = await connection.execute(query, values);
    console.log("Query result:", result);

    await connection.end();
    console.log("Connection closed");

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}