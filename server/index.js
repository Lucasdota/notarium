const express = require("express");
const todosRoutes = require("./todos.routes")
const app = express();
const { Pool } = require("pg");

// Create a PostgreSQL pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "notarium",
  password: "0705",
  port: 5432
});

// Test the PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL:", res.rows[0].now);
  }
});

// Define a route to fetch available databases
app.get("/databases", async (req, res) => {
  try {
    // Query to fetch all database names
    const query = "SELECT datname FROM pg_database WHERE datistemplate = false;";

    // Execute the query
    const { rows } = await pool.query(query);

    // Extract database names from query result
    const databaseNames = rows.map(row => row.datname);

    // Send the list of database names as JSON response
    res.json(databaseNames);
  } catch (error) {
    console.error("Error fetching databases:", error);
    res.status(500).json({ error: "Failed to fetch databases" });
  }
});

app.get("/", (req, res) => {
	return res.json("up")
})

app.listen(5432, () => {
	console.log("Rodando na porta 5432")
})