const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || "5000";

app.use(expressLayouts);
// Assets...
app.use(express.static("public"));
// Set Template Engine...
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/register", (req, res) => {
  res.render("auth/register");
});

app.get("/cart", (req, res) => {
  res.render("customers/cart");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
