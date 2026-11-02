import { Router } from 'express';
import mongoose from 'mongoose';
import { protect, authorize } from '../middlewares/auth.js';

// Simple routes used to check that the server, database and auth middleware work.
// They return no private data.
const router = Router();

const DB_STATES = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

// GET /api/test/ping -> is the server alive?
router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'pong', time: new Date().toISOString() });
});

// GET /api/test/db -> is MongoDB connected? (503 if not)
router.get('/db', (req, res) => {
  const state = mongoose.connection.readyState;
  const connected = state === 1;
  res.status(connected ? 200 : 503).json({
    success: connected,
    database: DB_STATES[state],
  });
});

// GET /api/test/auth -> needs a valid token (any role)
router.get('/auth', protect, (req, res) => {
  res.json({ success: true, message: 'Token is valid', role: req.user.role });
});

// GET /api/test/vendor -> needs a token of a vendor or admin
router.get('/vendor', protect, authorize('vendor', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Vendor/admin access OK', role: req.user.role });
});

export default router;
