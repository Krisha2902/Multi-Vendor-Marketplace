import User from '../models/User.js';

export const findByEmail = (email, withPassword = false) => {
  const q = User.findOne({ email });
  return withPassword ? q.select('+password') : q;
};

export const findById = (id) => User.findById(id);

export const createUser = (data) => User.create(data);