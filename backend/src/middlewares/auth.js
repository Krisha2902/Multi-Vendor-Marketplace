import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new ApiError(401, 'Not authenticated');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await userRepo.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found or disabled');
  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Access denied'));
  next();
};