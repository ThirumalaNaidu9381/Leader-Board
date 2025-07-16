import mongoose from 'mongoose';

export default mongoose.model(
  'ClaimHistory',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      points: { type: Number, required: true }
    },
    { timestamps: true }
  )
);
