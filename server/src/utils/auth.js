import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
export const signToken = (user) => jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
