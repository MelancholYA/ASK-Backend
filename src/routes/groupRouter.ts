import { Router } from "express";
import fileUpload from "express-fileupload";
import multer from "multer";
import {
  createGroup,
  getGroups,
  joinGroup,
  leaveGroup,
} from "../controllers/groupController";
import { protectForUser } from "../middlwares/authMiddlware";

const groupRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },

  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

groupRouter.get("/:currentPage", protectForUser, getGroups);
groupRouter.post("/:groupId/join", protectForUser, joinGroup);
groupRouter.post("/:groupId/leave", protectForUser, leaveGroup);

groupRouter.post(
  "/new",
  protectForUser,
  upload.fields([{ name: "cover" }, { name: "avatar" }]),
  createGroup
);

export { groupRouter };
