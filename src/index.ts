import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socketTypres";
import { authRouter } from "./routes/authRouter";
import { errrorHandler } from "./middlwares/errorHandler";
import { connectDB } from "./config/db";
import { JwtPayload } from "jsonwebtoken";
import { postRouter } from "./routes/postRouter";
require("dotenv").config();

declare module "express-serve-static-core" {
  interface Request {
    user: JwtPayload;
  }
}
declare module "jsonwebtoken" {
  interface JwtPayload {
    _id: mongoose.Types.ObjectId;
    email: string;
  }
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("a user connected");
});
app.get("/api", (req, res) => {
  res.send("hi there");
});

app.use("/api/users", authRouter);
app.use("/api/posts", postRouter);

app.use(errrorHandler);

server.listen(port, () => {
  console.log("listening on port:" + port);
});
