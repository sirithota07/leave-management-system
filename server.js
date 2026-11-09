// ============ SERVER ENTRY POINT ============
require("dotenv").config(); // load .env first

const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leaves", require("./routes/leaves"));

// Unknown API route
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found." }));

// Create the admin account automatically if none exists
async function seedAdmin() {
  const [rows] = await db.getPool().execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (rows.length > 0) return;

  const email = (process.env.ADMIN_EMAIL || "admin@company.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  await db.getPool().execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
    [process.env.ADMIN_NAME || "Admin", email, await bcrypt.hash(password, 10)]
  );
  console.log(`Admin created -> ${email} / ${password}`);
}

async function start() {
  try {
    await db.init();
    console.log("MySQL connected, tables ready");
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("Could not start:", err.code || "", err.message);
    console.error("Check: 1) MySQL is running  2) DB_USER / DB_PASSWORD in .env are correct  3) DB_HOST and DB_PORT");
    process.exit(1);
  }
}

start();
