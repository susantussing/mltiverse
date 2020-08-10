import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { pubSub, USER_UPDATED } from '../graphql/pubSub';

const userSchema = new Schema({
  name: String,
  password: String,
  worlds: [{
    type: Schema.ObjectId,
    ref: 'World',
  }],
  currentWorld: {
    type: Schema.ObjectId,
    ref: 'World',
  },
});

// eslint-disable-next-line consistent-return
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    // Publish other updates to the client
    pubSub.publish(USER_UPDATED, { userUpdate: this });
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  });
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
