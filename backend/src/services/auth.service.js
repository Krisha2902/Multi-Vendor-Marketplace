import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) throw new ApiError(400, 'All fields are required');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const existing = await userRepo.findByEmail(email.toLowerCase());
  if (existing) throw new ApiError(409, 'Email already registered');

  // Public register hamesha customer banata hai, role body se nahi lete
  const user = await userRepo.createUser({ name, email, password });
  return { user: sanitize(user), token: signToken(user) };
};

export const login = async ({ email, password }) => {
  if (!email || !password) throw new ApiError(400, 'Email and password required');

  const user = await userRepo.findByEmail(email.toLowerCase(), true);
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');

  return { user: sanitize(user), token: signToken(user) };
};