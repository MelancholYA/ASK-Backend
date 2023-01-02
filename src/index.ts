import { config } from "dotenv";
import express from "express";
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
require("dotenv").config();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

connectDB();

app.get("/api", (req: any, res: any) => {
  res.send("hi there");
});

app.use("/api/users", authRouter);

io.on("connection", (socket: any) => {
  console.log("a user connected");
});

app.use(errrorHandler);

server.listen(port, () => {
  console.log("listening on port:" + port);
});