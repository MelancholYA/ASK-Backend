"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectForUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectForUser = (req, res, next) => {
    const token = req.headers["x-auth-token"];
    if (!token) {
        res.status(400);
        throw new Error("Unauthorized : no token provided");
    }
    if (Array.isArray(token)) {
        res.status(400);
        throw new Error("Unauthorized : malformed token");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (typeof decoded === "string") {
            res.status(400);
            throw new Error("Unauthorized : Malformed token");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new Error("Unauthorized");
    }
};
exports.protectForUser = protectForUser;
