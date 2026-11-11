import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (payload = {}) => {
  const { name, email, password } = payload || {};
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  if (!trimmedName || !normalizedEmail || !password) {
    throw new ApiError(400, 'All fields are required');
  }
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, 'Please enter a valid email address');
  }
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const existing = await userRepo.findByEmail(normalizedEmail);
  if (existing) throw new ApiError(409, 'Email already registered');

  // Public register hamesha customer banata hai, role body se nahi lete
  const user = await userRepo.createUser({
    name: trimmedName,
    email: normalizedEmail,
    password,
  });
  return { user: sanitize(user), token: signToken(user) };
};

export const login = async (payload = {}) => {
  const { email, password } = payload || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new ApiError(400, 'Email and password required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) throw new ApiError(400, 'Email and password required');

  const user = await userRepo.findByEmail(normalizedEmail, true);
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');

  return { user: sanitize(user), token: signToken(user) };
};