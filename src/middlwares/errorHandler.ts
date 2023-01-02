import { NextFunction, Response, Request } from "express";

interface IerrBody {
  message: string;
  stack?: string;
}
type TerrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const errrorHandler: TerrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const errBody: IerrBody = {
    message: err.message || "Something went wrong",
    stack: err.stack,
  };
  if (process.env.NODE_ENV === "production") {
    delete errBody.stack;
  }
  res.status(statusCode).json(errBody);
};

export { errrorHandler };
