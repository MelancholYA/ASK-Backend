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
exports.getGroups = exports.createGroup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const groupModel_1 = require("../models/groupModel");
const createGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, topic } = req.body;
    if (!req.files) {
        throw new Error("No files");
    }
    if (!name || !description || !topic) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const groupBody = {
        name,
        description,
        topic,
        members: [req.user._id],
    };
    if (req.files) {
        const cover = Array.isArray(req.files["cover"])
            ? req.files.cover[0]
            : req.files.cover;
        const avatar = Array.isArray(req.files["avatar"])
            ? req.files["avatar"][0]
            : req.files["avatar"];
        if (cover) {
            //ts-ignore
            groupBody.cover = "/" + cover.path;
        }
        if (avatar) {
            groupBody.avatar = "/" + avatar.path;
        }
    }
    groupModel_1.Group.create(groupBody)
        .then((group) => {
        res.status(200).json({ ok: true, group });
    })
        .catch((err) => {
        throw new Error(err);
    });
}));
exports.createGroup = createGroup;
const getGroups = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    groupModel_1.Group.find()
        .then((groups) => res.status(200).json({ ok: true, groups }))
        .catch((err) => {
        throw new Error(err);
    });
}));
exports.getGroups = getGroups;
