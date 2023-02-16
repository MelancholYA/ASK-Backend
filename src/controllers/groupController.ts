import { Request, Response, Express } from "express";
import asyncHnadler from "express-async-handler";
import { FileArray } from "express-fileupload";
import fs from "fs";
import mongoose from "mongoose";
import { Group } from "../models/groupModel";

type TgroupBody = {
  name: string;
  description: string;
  topic: string;
  members: [mongoose.Types.ObjectId];
  cover?: string;
  avatar?: string;
};

const createGroup = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, topic } = req.body;

    if (!req.files) {
      throw new Error("No files");
    }

    if (!name || !description || !topic) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    const groupBody: TgroupBody = {
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
        groupBody.cover = "/" + cover.path;
      }
      if (avatar) {
        groupBody.avatar = "/" + avatar.path;
      }
    }
    Group.create(groupBody)
      .then((groupDoc) => {
        const group = groupDoc.toObject();
        group.joined = group.members
          .map((member: string) => String(member))
          .includes(req.user._id);
        res.status(200).json({ ok: true, group });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

const getGroups = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const pageSize = 10;
    const { currentPage } = req.params;
    const startIndex = (parseInt(currentPage) - 1) * pageSize;
    const totalDocuments = await Group.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    Group.find()
      .skip(startIndex)
      .limit(pageSize)
      .select("-posts")
      .then((groupsDoc) => {
        const groups = groupsDoc.map((groupDoc) => {
          const group = groupDoc.toObject();
          group.joined = group.members
            .map((member: string) => String(member))
            .includes(req.user._id);
          return group;
        });
        res.status(200).json({
          ok: true,
          groups,
          hasNextPage: parseInt(currentPage) < totalPages,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

const joinGroup = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    const _id: any = req.user._id;

    Group.findById(groupId)
      .then((group) => {
        if (!group) {
          res.status(400).json({ message: "No group with this ID" });
          return;
        }
        if (group.members.includes(_id)) {
          res
            .status(400)
            .json({ message: "You're already a member of this group" });
          return;
        }
        group.members.push(_id);
        group.membersLength++;
        group.save();
        const objGroup = group.toObject();
        objGroup.joined = true;
        res.status(200).json({ ok: true, group: objGroup });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

const leaveGroup = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    const { _id } = req.user;

    Group.findByIdAndUpdate(groupId, {
      $pull: { members: _id },
      $inc: { membersLength: -1 },
    })
      .then((group) => {
        if (!group) {
          throw new Error("No group was found");
        }
        group.toObject().joined = false;
        res.status(200).json({ ok: true, group });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

export { createGroup, getGroups, joinGroup, leaveGroup };
