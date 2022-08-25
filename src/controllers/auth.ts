/* eslint-disable @typescript-eslint/no-unsafe-argument */
import passport from "passport";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "@models/user";
import bcrypt from "bcryptjs";

export const post_login = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(400).json({
      message: "Unexpected error",
      user: req.user,
    });
  }
  if (process.env.JWT_SECRET) {
    const token = jwt.sign(JSON.stringify(req.user), process.env.JWT_SECRET);
    return res.json({
      username: req.user.username,
      _id: req.user._id,
      token,
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const post_signup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const userObj = {
      username: req.body.username,
      password: hashedPassword,
    };
    const user = new User(userObj).save((err: any, userModel) => {
      if (err) {
        if (err.code == 11000) {
          return res.json({
            message: "Username already in use.",
          });
        }
        return next(err);
      }
      req.login(userModel, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        if (process.env.JWT_SECRET) {
          const token = jwt.sign(
            JSON.stringify(req.user),
            process.env.JWT_SECRET
          );
          return res.json({
            username: req.user?.username,
            _id: req.user?._id,
            token,
          });
        } else {
          res.status(500).json({
            message: "Internal server error",
          });
        }
      });
    });
  });
};
