"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const authRouter_1 = require("./routes/authRouter");
const errorHandler_1 = require("./middlwares/errorHandler");
const db_1 = require("./config/db");
const postRouter_1 = require("./routes/postRouter");
require("dotenv").config();
const io = new socket_io_1.Server(server);
(0, db_1.connectDB)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
io.on("connection", (socket) => {
    console.log("a user connected");
});
app.get("/api", (req, res) => {
    res.send("hi there");
});
app.use("/api/users", authRouter_1.authRouter);
app.use("/api/posts", postRouter_1.postRouter);
app.use(errorHandler_1.errrorHandler);
server.listen(port, () => {
    console.log("listening on port:" + port);
});
