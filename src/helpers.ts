import { Types } from "mongoose";
import JWT from "jsonwebtoken";
import bcrpt from "bcryptjs";

const encryptPass = async (pass: string): Promise<string> => {
  const salt = await bcrpt.genSalt(7);
  const hashed = await bcrpt.hash(pass, salt);
  return hashed;
};
const signToken = (payload: { id: Types.ObjectId; email: string }) => {
  const secret = process.env.JWT_SECRET || "";
  return JWT.sign(payload, secret);
};

export { encryptPass, signToken };
