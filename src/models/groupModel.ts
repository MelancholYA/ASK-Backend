import mongoose, { model, Schema } from "mongoose";
import { Igroup } from "../types/types";

const groupSchema = new Schema<Igroup>({
  name: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  membersLength: {
    type: Number,
    default: 1,
  },
  topic: {
    type: String,
    required: true,
  },
  postsLength: {
    type: Number,
    default: 0,
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});
const Group = model("Group", groupSchema);

export { Group };
