import jwt from 'jsonwebtoken';
import { config } from '../config/database';

export const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};