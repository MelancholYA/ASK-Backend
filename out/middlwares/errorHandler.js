"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errrorHandler = void 0;
const errrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const errBody = {
        message: err.message || "Something went wrong",
        stack: err.stack,
    };
    if (process.env.NODE_ENV === "production") {
        delete errBody.stack;
    }
    res.status(statusCode).json(errBody);
};
exports.errrorHandler = errrorHandler;
