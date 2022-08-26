import Post, { IPost } from "@models/post";
import { Request, Response, NextFunction } from "express";
import Comment from "@models/comment";
import User from "@models/user";

export const create_post = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const newPost = new Post<IPost>({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
    public: req.body.public,
  });

  newPost.save((err, post) => {
    if (err) {
      return next(err);
    }
    res
      .status(201)
      .location("/posts/" + post._id)
      .json(post);
  });
};

export const get_posts = (req: Request, res: Response, next: NextFunction) => {
  Post.find({ public: true })
    .sort("createdAt")
    .populate("author", "username")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      res.json(posts);
    });
};

export const get_post = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.id)
    .populate("author", "username")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      res.json(post);
    });
};

export const get_comments = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Comment.find({ post: req.params.id })
    .populate("user", "username")
    .exec((err, comments) => {
      if (err) {
        return next(err);
      }
      res.json(comments);
    });
};

export const delete_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    process.env.ADMIN_ID !== req.user?._id.toString() &&
    req.user?._id.toString() !== req.params.id
  ) {
    // User is not authorized to delete
    res.sendStatus(403);
    return;
  }
  //Delete post and all its comments
  await Promise.all([
    Post.findByIdAndDelete(req.params.id).exec(),
    Comment.deleteMany({ post: req.params.id }).exec(),
  ]).catch((err) => {
    return next(err);
  });
  res.sendStatus(204);
  return;
};

export const delete_comment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    process.env.ADMIN_ID !== req.user?._id.toString() &&
    req.user?._id.toString() !== req.params.id
  ) {
    // User is not authorized to delete
    res.sendStatus(403);
    return;
  }
  Comment.findByIdAndDelete(req.params.commentid).exec((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
    return;
  });
};

export const create_comment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) {
      return next(err);
    }
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    const newComment = new Comment({
      post: req.params.id,
      user: req.user._id,
      content: req.body.comment,
    });

    newComment.save((err, comment) => {
      if (err) {
        return next(err);
      }
      res
        .status(201)
        .location("/post/" + req.params.id)
        .json({
          comment,
        });
    });
  });
};

export const update_post = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user._id.toString() !== req.params.id) {
    res.sendStatus(403);
    return;
  }
  Post.findByIdAndUpdate(req.params.id, req.body as IPost, { new: true }).exec(
    (err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
      return;
    }
  );
};

export const get_user_posts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user._id.toString() === req.params.id) {
    Post.find({ author: req.params.id })
      .populate("author", "username")
      .exec((err, posts) => {
        if (err) {
          return next(err);
        }
        res.json(posts);
      });
  } else {
    Post.find({ user: req.params.id, public: true })
      .populate("author", "username")
      .exec((err, posts) => {
        if (err) {
          return next(err);
        }
        res.json(posts);
      });
  }
};

export const get_user = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id).exec((err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      res.sendStatus(404);
      return;
    }
    res.json({
      username: user.username,
      _id: user._id,
    });
  });
}