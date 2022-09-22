import { Context } from 'koa';
import { Repository } from 'typeorm';

import { dataSource } from '@/dataSource';
import { User } from '@/entity/User';

import { encodeJWT } from '@/utils/authTokenUtil';

export default class UserController {
  public static async signUp(ctx: Context) {
    if (!('email' in ctx.request.body) || !('password' in ctx.request.body)) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Invalid request',
        payload: {},
      };
      return;
    }

    const userRepository: Repository<User> = dataSource.getRepository(User);
    const existUser = await userRepository.findOne({
      where: {
        email: ctx.request.body['email'],
      },
    });

    if (existUser) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Email already exists',
        payload: {},
      };
      return;
    }

    const user = new User();
    user.email = ctx.request.body['email'];
    user.password = ctx.request.body['password'];
    await userRepository.save(user);

    let token = null;
    try {
      token = await encodeJWT({ email: user.email });
    } catch (e) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Internal error',
        payload: {},
      };
      return;
    }
    ctx.set({ authorization: token });
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: '',
      payload: { email: user.email },
    };
  }

  public static async signIn(ctx: Context) {
    if (!('email' in ctx.request.body) || !('password' in ctx.request.body)) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Invalid request',
        payload: {},
      };
      return;
    }

    const userRepository: Repository<User> = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: ctx.request.body['email'],
      },
    });

    if (!user) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Non-existing Email',
        payload: {},
      };
      return;
    }

    const validPassword = await user.comparePassword(ctx.request.body['password']);
    if (!validPassword) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'Wrong password',
        payload: {},
      };
      return;
    } else {
      let token = null;
      try {
        token = await encodeJWT({ email: user.email });
      } catch (e) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          message: 'Internal error',
          payload: {},
        };
        return;
      }
      ctx.status = 200;
      ctx.set({ authorization: token });
      ctx.body = {
        success: true,
        message: '',
        payload: {
          email: user.email,
        },
      };
    }
  }

  public static signOut(ctx: Context) {
    ctx.set({});
    ctx.status = 204;
  }
}
