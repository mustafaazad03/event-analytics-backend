import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/database';

const prisma = new PrismaClient();

export class AuthService {
  async validateToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      return user;
    } catch {
      return null;
    }
  }
}