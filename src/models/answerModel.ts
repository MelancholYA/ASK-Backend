import mongoose, { model, Schema } from "mongoose";
import { Ianswer } from "../types/types";

const answerSchema = new Schema<Ianswer>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    repliesLength: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Reply",
      },
    ],

    body: String,
    post: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

const Answer = model<Ianswer>("Answer", answerSchema);

export { Answer };
