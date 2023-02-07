"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.logIn = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const helpers_1 = require("../helpers");
const logIn = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!password || !email) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const user = yield userModel_1.User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("We don't recognise this email");
    }
    const passwordsMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!passwordsMatch) {
        res.status(400);
        throw new Error("Wrong password");
    }
    const token = (0, helpers_1.signToken)({ _id: user._id, email: user.email });
    const userData = {
        _id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        avatar: user.avatar,
    };
    res.status(200).json({ token, user: userData });
}));
exports.logIn = logIn;
const register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, password, email, } = req.body;
    if (!firstName || !lastName || !password || !email) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const newPass = yield (0, helpers_1.encryptPass)(password);
    const userExist = yield userModel_1.User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists , please login");
    }
    yield userModel_1.User.create({
        firstName,
        lastName,
        password: newPass,
        email,
    })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const jwt = (0, helpers_1.signToken)({
            _id: user._id,
            email: user.email,
        });
        yield user.save();
        const userData = {
            _id: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
            avatar: user.avatar,
        };
        res.status(200).json({ token: jwt, user: userData });
    }))
        .catch((error) => {
        throw new Error(error);
    });
}));
exports.register = register;
