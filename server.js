const path = require("path");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || "5000";

// Set Template Engine...
app.set(expressEjsLayouts);
app.set("views", path.join(__dirname, "./resources/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
