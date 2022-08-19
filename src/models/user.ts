import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IUser{
  username: string,
  password: string,
}

const User = new Schema<IUser>({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})

export default mongoose.model("User", User);