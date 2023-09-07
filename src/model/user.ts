import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: String,
    email: String,
    password: String,
  },
  { strict: false }
);

export default mongoose.model<IUser>("User", userSchema);
