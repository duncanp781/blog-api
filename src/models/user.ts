import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser{
  username: string,
  password: string,
  _id: mongoose.Types.ObjectId,
}

const User = new Schema<IUser>({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})

export default mongoose.model<IUser>("User", User);