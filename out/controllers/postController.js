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
exports.getReplies = exports.replyComment = exports.getPostComments = exports.commentPost = exports.getPosts = exports.createPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const postModel_1 = require("../models/postModel");
const answerModel_1 = require("../models/answerModel");
const replyModel_1 = require("../models/replyModel");
const createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, chip, group } = req.body;
    const { user } = req;
    console.log({ body, chip, user });
    if (!body || !chip) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    postModel_1.Post.create({
        body,
        chip,
        user: user._id,
    })
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield result.populate([
            {
                path: "user",
                select: "-password",
            },
            {
                path: "group",
                select: "_id name",
            },
        ]);
        res.status(201).json({ ok: true, post });
    }))
        .catch((err) => {
        res.status(500);
        throw new Error(err);
    });
}));
exports.createPost = createPost;
const getPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = 10;
    const { currentPage } = req.params;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = yield postModel_1.Post.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);
    postModel_1.Post.find()
        .skip(startIndex)
        .limit(pageSize)
        .populate([
        {
            path: "user",
            select: "-password",
        },
        {
            path: "group",
            select: "_id name",
        },
    ])
        .sort({ createdAt: -1 })
        .select("-answers -createdAt -updatedAt -__v")
        .then((posts) => {
        res.json({
            ok: true,
            posts,
            hasNextPage: parseInt(currentPage) < totalPages,
        });
    })
        .catch((err) => {
        res.status(500);
        throw new Error(err);
    });
}));
exports.getPosts = getPosts;
const commentPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, body, postId } = req.body;
    console.log({ userId, body, postId });
    if (!userId || !body || !postId) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    answerModel_1.Answer.create({
        user: userId,
        body,
        post: postId,
    })
        .then((answer) => __awaiter(void 0, void 0, void 0, function* () {
        yield postModel_1.Post.findByIdAndUpdate(postId, {
            $push: { answers: answer._id },
            $inc: { answersLength: 1 },
        })
            .then((ok) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield answer.populate([
                {
                    path: "user",
                },
            ]);
            res.status(201).json({ ok: true, answer: result });
        }))
            .catch((err) => {
            throw new Error(err);
        });
    }))
        .catch((err) => {
        throw new Error(err);
    });
}));
exports.commentPost = commentPost;
const getPostComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = 10;
    const { currentPage, postId } = req.params;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = yield answerModel_1.Answer.countDocuments({ post: postId });
    const totalPages = Math.ceil(totalDocuments / pageSize);
    answerModel_1.Answer.find({
        post: postId,
    })
        .skip(startIndex)
        .limit(pageSize)
        .select("-replies -__v")
        .sort({ createdAt: -1 })
        .populate([
        {
            path: "user",
            select: "-password -__v -email",
        },
    ])
        .then((answers) => {
        res.status(200).json({
            ok: true,
            answers,
            hasNextPage: parseInt(currentPage) < totalPages,
        });
    })
        .catch((err) => {
        res.status(500);
        throw new Error(err);
    });
}));
exports.getPostComments = getPostComments;
const replyComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, answerId } = req.params;
    const { _id } = req.user;
    const { body } = req.body;
    if (!body) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    replyModel_1.Reply.create({
        user: _id,
        post: postId,
        answer: answerId,
        body,
    })
        .then((replyRaw) => __awaiter(void 0, void 0, void 0, function* () {
        yield answerModel_1.Answer.findByIdAndUpdate(answerId, {
            $push: { replies: replyRaw._id },
            $inc: { repliesLength: 1 },
        });
        const reply = yield replyRaw.populate([
            {
                path: "user",
                select: "-password -__v -email",
            },
        ]);
        res.status(201).json({ ok: true, reply });
    }))
        .catch((err) => {
        res.status(500);
        throw new Error(err);
    });
}));
exports.replyComment = replyComment;
const getReplies = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, answerId } = req.params;
    console.log({ postId, fd: answerId });
    replyModel_1.Reply.find({
        post: postId,
        answer: answerId,
    })
        .populate([
        {
            path: "user",
            select: "-password -__v -email",
        },
    ])
        .select("-__v -post -answer")
        .then((replies) => {
        res.status(200).json({ ok: true, replies });
    })
        .catch((err) => {
        res.status(500);
        throw new Error(err);
    });
}));
exports.getReplies = getReplies;
