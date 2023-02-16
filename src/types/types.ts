import mongoose, { Document } from "mongoose";

export interface Ichip {
  label: string;
  icon: string;
}

export interface Ianswer extends Document {
  post: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "Post";
  };
  user: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "User";
  };
  repliesLength: {
    type: number;
  };
  replies: {
    type: mongoose.Types.ObjectId;
    required: false;
    ref: "Reply";
  }[];
  body: string;
}

export interface IPost extends Document {
  user: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "User";
  };
  group: {
    type: mongoose.Types.ObjectId;
    required: false;
    ref: "Group";
  };
  body: string;
  chip: Ichip;
  answersLength: { type: number; required: false };
  answers?: {
    type: mongoose.Types.ObjectId;
    required: false;
    ref: "Answer";
  }[];
  liked?: boolean;
}

export interface Ireply extends Document {
  user: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "User";
  };
  body: string;
  post: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "Post";
  };
  answer: {
    type: mongoose.Types.ObjectId;
    required: true;
    ref: "Answer";
  };
}

export interface Igroup extends Document {
  name: {
    type: string;
    required: true;
  };
  cover: {
    type: string;
    required: false;
  };
  description: string;
  avatar: {
    type: string;
    required: false;
  };
  membersLength: number;
  topic: string;
  postsLength: {
    type: number;
    default: 0;
  };
  posts: {
    type: mongoose.Types.ObjectId;
    ref: "Post";
  }[];
  members: {
    type: mongoose.Types.ObjectId;
    ref: "User";
  }[];
}
