"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const groupController_1 = require("../controllers/groupController");
const authMiddlware_1 = require("../middlwares/authMiddlware");
const groupRouter = (0, express_1.Router)();
exports.groupRouter = groupRouter;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "public/images"));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
groupRouter.get("/:currentPage", authMiddlware_1.protectForUser, groupController_1.getGroups);
groupRouter.post("/:groupId/join", authMiddlware_1.protectForUser, groupController_1.joinGroup);
groupRouter.post("/:groupId/leave", authMiddlware_1.protectForUser, groupController_1.leaveGroup);
groupRouter.post("/new", authMiddlware_1.protectForUser, upload.fields([{ name: "cover" }, { name: "avatar" }]), groupController_1.createGroup);
