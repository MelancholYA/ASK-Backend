import asyncHnadler from "express-async-handler";
import { Request, Response } from "express";
import bycript from "bcryptjs";

import { User } from "../models/userModel";
import { encryptPass, signToken } from "../helpers";

const logIn = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;
    if (!password || !email) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("We don't recognise this email");
    }
    const passwordsMatch = await bycript.compare(password, user.password);
    if (!passwordsMatch) {
      res.status(400);
      throw new Error("Wrong password");
    }
    const token: string = signToken({ _id: user._id, email: user.email });
    const userData = {
      _id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      avatar: user.avatar,
    };
    res.status(200).json({ token, user: userData });
  }
);

const register = asyncHnadler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      firstName,
      lastName,
      password,
      email,
    }: {
      firstName: string;
      lastName: string;
      password: string;
      email: string;
    } = req.body;
    if (!firstName || !lastName || !password || !email) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    const newPass: string = await encryptPass(password);
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("User already exists , please login");
    }
    await User.create({
      firstName,
      lastName,
      password: newPass,
      email,
    })
      .then(async (user) => {
        const jwt: string = signToken({
          _id: user._id,
          email: user.email,
        });
        await user.save();
        const userData = {
          _id: user._id,
          name: user.firstName + " " + user.lastName,
          email: user.email,
          avatar: user.avatar,
        };
        res.status(200).json({ token: jwt, user: userData });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
);

export { logIn, register };
