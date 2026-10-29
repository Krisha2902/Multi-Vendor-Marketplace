import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, ...data });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.json({ success: true, ...data });
});

export const me = asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    user: { id: u._id, name: u.name, email: u.email, role: u.role },
  });
});