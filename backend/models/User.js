import mongoose from 'mongoose';

export default mongoose.model(
  'User',
  new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 }
  })
);
