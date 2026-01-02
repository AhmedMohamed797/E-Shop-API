import jwt from 'jsonwebtoken';

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
