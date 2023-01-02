import { Router } from "express";
import { logIn, register } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/new", register);
authRouter.post("/login", logIn);

export { authRouter };
