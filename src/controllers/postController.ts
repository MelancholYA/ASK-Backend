import mongoose from "mongoose";
import { Ichip } from "./../types/types";
import { Request, Response } from "express";
import asyncHnadler from "express-async-handler";

import { Post } from "../models/postModel";
import { Answer } from "../models/answerModel";
import { Reply } from "../models/replyModel";
import { Group } from "../models/groupModel";

type createPostBody = {
  body: string;
  chip: Ichip;
  group?: mongoose.Types.ObjectId;
};
type answerPostBody = {
  postId: mongoose.Types.ObjectId;
  body: string;
  userId: mongoose.Types.ObjectId;
};

const createPost = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { body, chip, group }: createPostBody = req.body;
    const { user } = req;
    console.log({ body, chip, group, f: req.body });
    if (!body || !chip) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    try {
      const post = await new Post({ body, chip, user: user._id }).populate([
        {
          path: "user",
          select: "-password",
        },
        {
          path: "group",
          select: "_id name",
        },
      ]);
      if (group) {
        let groupId: any = group;
        post.group = groupId;
        await Group.findByIdAndUpdate(groupId, {
          $inc: { postsLength: 1 },
          $push: { posts: post._id },
        });
      }
      post.save();
      res.status(201).json({ ok: true, post });
    } catch (error: any) {
      res.status(500);
      throw new Error(error);
    }

    // Post.create({
    //   body,
    //   chip,
    //   user: user._id,
    // })
    //   .then(async (result) => {
    //     const post = await result.populate([
    //       {
    //         path: "user",
    //         select: "-password",
    //       },
    //       {
    //         path: "group",
    //         select: "_id name",
    //       },
    //     ]);
    //     res.status(201).json({ ok: true, post });
    //   })
    //   .catch((err) => {
    //     res.status(500);
    //     throw new Error(err);
    //   });
  }
);

const getPosts = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const pageSize = 10;
    const { currentPage } = req.params;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = await Post.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    Post.find()
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
        console.log(posts)
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
  }
);

const getGroupPosts = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { groupID, currentPage } = req.params;
    const pageSize = 10;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = await Post.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    try {
      const groupPosts = await Post.find({ group: groupID })
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
        .select("-answers -createdAt -updatedAt -__v");
      console.log({ groupPosts });
      res.json({
        ok: true,
        posts: groupPosts,
        hasNextPage: parseInt(currentPage) < totalPages,
      });
    } catch (error: any) {
      res.status(500);
      throw new Error(error);
    }
  }
);

const commentPost = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId, body, postId }: answerPostBody = req.body;
    if (!userId || !body || !postId) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    Answer.create({
      user: userId,
      body,
      post: postId,
    })
      .then(async (answer) => {
        await Post.findByIdAndUpdate(postId, {
          $push: { answers: answer._id },
          $inc: { answersLength: 1 },
        })
          .then(async (ok) => {
            const result = await answer.populate([
              {
                path: "user",
              },
            ]);
            res.status(201).json({ ok: true, answer: result });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

const getPostComments = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const pageSize = 10;
    const { currentPage, postId } = req.params;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = await Answer.countDocuments({ post: postId });
    const totalPages = Math.ceil(totalDocuments / pageSize);
    Answer.find({
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
  }
);

const replyComment = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId, answerId } = req.params;
    const { _id } = req.user;
    const { body } = req.body;
    if (!body) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    Reply.create({
      user: _id,
      post: postId,
      answer: answerId,
      body,
    })
      .then(async (replyRaw) => {
        await Answer.findByIdAndUpdate(answerId, {
          $push: { replies: replyRaw._id },
          $inc: { repliesLength: 1 },
        });
        const reply = await replyRaw.populate([
          {
            path: "user",
            select: "-password -__v -email",
          },
        ]);
        res.status(201).json({ ok: true, reply });
      })
      .catch((err) => {
        res.status(500);
        throw new Error(err);
      });
  }
);

const getReplies = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId, answerId } = req.params;

    Reply.find({
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
  }
);

export {
  createPost,
  getPosts,
  commentPost,
  getPostComments,
  replyComment,
  getReplies,
  getGroupPosts,
};
