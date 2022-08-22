import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { post_login, post_signup } from "src/controllers/auth";
import passport from "passport";
import {
  create_post,
  create_comment,
  get_post,
  get_posts,
  get_comments,
  delete_post,
  delete_comment,
  get_user_posts,
} from "src/controllers/postController";

// Export the base-router
const router = Router();

//Passport authenticate returns an any type for some reason
//So we just cast it to RequestHandler
router.post(
  "/login",
  passport.authenticate("local", { session: false }) as RequestHandler,
  post_login
);
router.post("/signup", post_signup);

router.get("/posts", get_posts);

// Creating a post is protected
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }) as RequestHandler,
  create_post
);

router.get("/post/:id", get_post);

router.get("/post/:id/comments", get_comments);

router.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }) as RequestHandler,
  delete_post
);

//Posting on a specific post is making a comment, and requires auth

router.post(
  "/post/:id",
  passport.authenticate("jwt", { session: false }) as RequestHandler,
  create_comment
);

router.delete(
  "/post/:id/comment/:commentid",
  passport.authenticate("jwt", { session: false }) as RequestHandler,
  delete_comment
);

//Will show the public posts of the user if not logged in as the user, otherwise shows all
router.get("/user/:id/posts", get_user_posts)

// Export default.
export default router;
