import { Router } from "express";
import {
  createPost,
  getPosts,
  commentPost,
  getPostComments,
  replyComment,
  getReplies,
  getGroupPosts,
} from "../controllers/postController";
import { protectForUser } from "../middlwares/authMiddlware";

const postRouter = Router();

postRouter.get("/:currentPage", protectForUser, getPosts);
postRouter.post("/new", protectForUser, createPost);
postRouter.post("/answer", protectForUser, commentPost);
postRouter.get("/:groupID/:currentPage", protectForUser, getGroupPosts);
postRouter
  .route("/:postId/:answerId/replies")
  .get(protectForUser, getReplies)
  .post(protectForUser, replyComment);
postRouter.get(
  "/:postId/answers/:currentPage",
  protectForUser,
  getPostComments
);

export { postRouter };
