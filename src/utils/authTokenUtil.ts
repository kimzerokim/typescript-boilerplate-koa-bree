import { BaseContext, DefaultContext } from 'koa';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { config } from '@/config';
import { User } from '@/entity/User';
import { dataSource } from '@/dataSource';

const jwtSecret = config.jwtSecret;

export function encodeJWT(payload: { email: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '7d',
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

export function decodeJWT(token: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded as jwt.JwtPayload);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function jwtMiddleware(ctx: BaseContext & DefaultContext, next: () => Promise<any>) {
  const token = ctx.request.get('authorization');

  if (!token) return next();

  try {
    const decoded = await decodeJWT(token);

    const userRepository: Repository<User> = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: decoded.email,
      },
    });

    ctx.request.user = user;
  } catch (e) {
    ctx.request.user = null;
  }

  return next();
}
