"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post("/new", authControllers_1.register);
authRouter.post("/login", authControllers_1.logIn);
