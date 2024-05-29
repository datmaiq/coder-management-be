import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  name: string;
  description: string;
  status: 'pending' | 'working' | 'review' | 'done' | 'archive';
  userId: mongoose.Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'working', 'review', 'done', 'archive'], required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
  isDeleted: {type: Boolean, required: true},
  createdAt: {type: String, required: true},
  updatedAt: {type: String, require: true},
});

// Create and export Task model
const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
