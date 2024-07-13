import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token expires after 1 hour
  },
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
export default ResetToken;
