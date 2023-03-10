"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authMiddlware_1 = require("../middlwares/authMiddlware");
const postRouter = (0, express_1.Router)();
exports.postRouter = postRouter;
postRouter.get("/:currentPage", authMiddlware_1.protectForUser, postController_1.getPosts);
postRouter.post("/new", authMiddlware_1.protectForUser, postController_1.createPost);
postRouter.post("/answer", authMiddlware_1.protectForUser, postController_1.commentPost);
postRouter.get("/:groupID/:currentPage", authMiddlware_1.protectForUser, postController_1.getGroupPosts);
postRouter
    .route("/:postId/:answerId/replies")
    .get(authMiddlware_1.protectForUser, postController_1.getReplies)
    .post(authMiddlware_1.protectForUser, postController_1.replyComment);
postRouter.get("/:postId/answers/:currentPage", authMiddlware_1.protectForUser, postController_1.getPostComments);
