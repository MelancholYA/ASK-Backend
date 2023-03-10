import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
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
import { groupRouter } from "./routes/groupRouter";

require("dotenv").config();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173/",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use("/api/users", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/groups", groupRouter);

app.use(errrorHandler);

server.listen(port, () => {
  console.log("listening on port:" + port);
});
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
declare module "express-fileupload" {
  interface UploadedFile {
    path: string;
  }
}
