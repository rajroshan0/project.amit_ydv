const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "users.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "proggram.html"));
});

app.get("/registration", (req, res) => {
  res.sendFile(path.join(__dirname, "registration page", "index(R).html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login page", "index (L).html"));
});

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "payment.html"));
});

app.get("/logout", (req, res) => {
  res.clearCookie("loggedUser");
  res.redirect("/");
});

function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { fullname, username, password, email, gender } = req.body;
  const users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.send("<h2>Username already exists. <a href='/registration'>Go back</a></h2>");
  }

  users.push({ fullname, username, password, email, gender });
  saveUsers(users);

  res.redirect("/login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.send("<h2>Invalid username or password. <a href='/login'>Go back</a></h2>");
  }

  res.cookie("loggedUser", user.username, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
