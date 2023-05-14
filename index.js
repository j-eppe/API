const express = require("express");
const mysql = require("mysql");
const app = express();

// Skapa en anslutning till databasen
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restapi",
});

// Anslut till databasen
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Databasen är ansluten.");
});

// Konfigurera express att tolka inkommande JSON-data i POST-förfrågan
app.use(express.json());

// Route för roten av APIet
app.get("/", (req, res) => {
  res.send(`
    <h1>Välkommen till mitt API</h1>
    <p>Här är en lista över tillgängliga routes:</p>
    <ul>
      <li><a href="/api/users">/api/users</a></li>
      <li><a href="/api/users/:id">/api/users/:id</a></li>
      <li><a href="/api/email">/api/email</a></li>
    </ul>
  `);
});

// Route för att hämta alla användare från databasen
app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// Route för att hämta en enskild användare från databasen
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      res.status(404).send("Användaren hittades inte.");
    } else {
      res.send(result[0]);
    }
  });
});

// Route för att lägga till en ny användare i databasen
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      throw err;
    }
    const newUser = { id: result.insertId, name, email };
    res.send(newUser);
  });
});

// Route för /api/email
app.get("/api/email", (req, res) => {
  const sql = "SELECT email FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// Route för att läsa av query-parametrar
app.get("/api/products/search", (req, res) => {
  const searchQuery = req.query.q;
  res.send(`Sökning efter "${searchQuery}" har begärts.`);
});

// Starta servern
const port = 5000;
app.listen(port, () => {
  console.log(`Servern är igång på http://localhost:${port}`);
});
