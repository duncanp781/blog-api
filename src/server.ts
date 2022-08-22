import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import jwt from 'jsonwebtoken';
import passportJWT from 'passport-jwt';
import User, { IUser } from "@models/user";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import { ExtractJwt } from "passport-jwt";
import router from "@routes/api";

// Constants
const app = express();


// Set up DB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  } as mongoose.ConnectOptions);
}

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === "production") {
  // This is clearly not an any type, but still getting the error.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(compression());
  app.use(helmet());
}

//Setting up auth
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      username: string,
      password: string,
      _id: mongoose.Types.ObjectId,
    }
  }
}

passport.use(new LocalStrategy( function(username, password, done){
  User.findOne({username: username}, (err: Error, user: any) => {
    if (err){
      return done(err);
    }
    if(!user){
      return done(null, false, {message:"Incorrect username or password"});
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    bcrypt.compare(password, user.password, (err, res) => {
      if(err){
        return done(err, user);
      }
      if (res) {
        // passwords match! log user in
        return done(null, user)
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect username or password" })
      }
    })
  })
}))

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//Middleware we use for authorized routes
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, cb) => {
  User.findOne({username: jwtPayload.username}).exec((err, user) => {
    if(err){
      return cb(err);
    }
    return cb(null, user);
  })
}))

app.use(passport.initialize());


// Export here and start in a diff file (for testing).

app.use('/', router);

export default app;
