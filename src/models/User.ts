import mongoose, { Schema, Document } from 'mongoose';

// Define interface for User document
interface IUser extends Document {
  name: string;
  role: string;
}

// Define schema for User
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }
});

// Create and export User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
