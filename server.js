const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let logged = false;

/* ---- вход кнопкой ---- */
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    logged = true;
    res.redirect("/panel");
});

/* ---- панель ---- */
app.get("/panel", (req, res) => {
    if (!logged) return res.redirect("/");

    res.render("panel");
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});