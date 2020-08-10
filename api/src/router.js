import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User';
import RefreshToken from './models/RefreshToken';
import { blacklistToken } from './auth';

// Temporarily set up as REST API for testing

const router = express.Router();

const { TOKEN_SECRET, REFRESH_SECRET } = process.env;

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const payload = { name: user.name, _id: user._id };
        const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '15 minutes' });
        const refreshToken = jwt.sign({ token }, REFRESH_SECRET, { expiresIn: '14 days' });
        await RefreshToken.create({ user, refreshToken });
        res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
        res.send({ token, user: user.toJSON() });
      } else {
        res.status(401).send({
          message: 'Authentication failed',
        });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  const foundToken = await RefreshToken.findOne({ refreshToken }).populate('user');
  if (foundToken) {
    const user = { ...foundToken.user.toJSON() };
    const { name, _id } = user;
    const token = jwt.sign({ name, _id }, TOKEN_SECRET, { expiresIn: '15 minutes' });
    // User will stay signed in for two weeks after the last refresh
    // Refresh token is only valid for one use to minimize chance of misuse
    const newRefreshToken = jwt.sign({ token }, REFRESH_SECRET, { expiresIn: '14 days' });
    await foundToken.remove();
    await RefreshToken.create({ user: foundToken.user, refreshToken: newRefreshToken });
    res.cookie('refreshToken', newRefreshToken, { maxAge: 1209600000, httpOnly: true });
    res.send({ token, user });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

router.post('/logout', async (req, res) => {
  const { token } = req.body;
  const { refreshToken } = req.cookies;
  const foundRefreshToken = await RefreshToken.findOne({ refreshToken });
  if (foundRefreshToken && token) {
    await foundRefreshToken.remove();
    blacklistToken(token);
    res.clearCookie('refreshToken');
    res.send({ message: 'Logged out' });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

export default router;
