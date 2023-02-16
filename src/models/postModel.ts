import mongoose, { Schema, model } from "mongoose";
import { IPost } from "../types/types";

const postSchema = new Schema<IPost>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    group: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Group",
    },
    body: String,
    chip: {
      label: String,
      icon: String,
    },
    answersLength: { type: Number, required: false, default: 0 },
    liked: { type: Boolean, default: false },
    answers: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Answer",
      },
    ],
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export { Post };
