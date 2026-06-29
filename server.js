const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let online = 0;
let currentUser = null;

/* -------- ONLINE -------- */
io.on("connection", (socket) => {
    online++;
    io.emit("online", online);

    socket.on("disconnect", () => {
        online--;
        if (online < 0) online = 0;
        io.emit("online", online);
    });
});

/* -------- LOGIN -------- */
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const name = req.body.name || "User";

    currentUser = {
        id: Date.now(),
        name
    };

    res.redirect("/panel");
});

/* -------- PANEL -------- */
app.get("/panel", (req, res) => {
    if (!currentUser) return res.redirect("/error");
    res.render("panel", { user: currentUser });
});

/* -------- ERROR -------- */
app.get("/error", (req, res) => {
    res.render("error");
});

/* -------- START -------- */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});