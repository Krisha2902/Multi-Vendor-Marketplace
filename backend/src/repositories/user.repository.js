import User from '../models/User.js';

export const findByEmail = (email, withPassword = false) => {
  const q = User.findOne({ email });
  return withPassword ? q.select('+password') : q;
};

export const findById = (id) => User.findById(id);

export const createUser = (data) => User.create(data);

export const updateRole = (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true });

export const findAll = (filter = {}, skip = 0, limit = 50) =>
  User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

export const countAll = (filter = {}) => User.countDocuments(filter);

export const updateActiveStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true });