import mongoose, { Schema } from 'mongoose';

// Refresh tokens for JWT authentication
// Stores user reference to allow users to invalidate refresh tokens on logout
// Records should auto-delete shortly after 14 day mark
const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '14 days' },
  },
});

const RefreshToken = mongoose.model('RefreshToken', tokenSchema);

export default RefreshToken;
