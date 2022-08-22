import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IComment {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
  _id: mongoose.Types.ObjectId;
}

const Comment = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  content: { type: String, required: true },
}, {timestamps: true});

export default mongoose.model<IComment>("Comment", Comment);
