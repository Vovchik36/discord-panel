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

let logged = false;
let online = 0;

/* ---------- SOCKET.IO ---------- */

io.on("connection", (socket) => {
    online++;
    io.emit("online", online);

    socket.on("disconnect", () => {
        online--;

        if (online < 0) {
            online = 0;
        }

        io.emit("online", online);
    });
});

/* ---------- ВХОД ---------- */

app.get("/", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    logged = true;
    res.redirect("/panel");
});

/* ---------- ПАНЕЛЬ ---------- */

app.get("/panel", (req, res) => {
    if (!logged) {
        return res.redirect("/");
    }

    res.render("panel");
});

/* ---------- ЗАПУСК ---------- */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});