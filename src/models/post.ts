import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IPost {
  title: string,
  content: string,
  author: mongoose.Types.ObjectId,
  public: boolean,
  isMD?: boolean, 
}

const Post = new Schema<IPost>({
  title: {type: String, required: true},
  content: {type: String, required: true,},
  author: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  public: {type: Boolean, required: true},
  isMD : {type: Boolean, required: false},
}, {timestamps: true});

export default mongoose.model<IPost>("Post", Post);