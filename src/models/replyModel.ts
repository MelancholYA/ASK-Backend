import mongoose, { model, Schema } from "mongoose";
import { Ireply } from "../types/types";

const replySchema = new Schema<Ireply>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  body: String,
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  answer: {
    type: mongoose.Types.ObjectId,
    ref: "Answer",
  },
});

const Reply = model<Ireply>("Reply", replySchema);

export { Reply };
