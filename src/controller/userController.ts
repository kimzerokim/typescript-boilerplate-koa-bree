import { Context } from 'koa';
import { Repository } from 'typeorm';

import { dataSource } from '../dataSource';
import { User } from '../entity/User';

import { generateToken } from '../utils/authTokenUtil';

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
      token = await generateToken({ email: user.email });
    } catch (e) {
      ctx.throw(500, e);
    }
    ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: '',
      payload: {},
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
    } else {
      let token = null;
      try {
        token = await generateToken({ email: user.email });
      } catch (e) {
        ctx.throw(500, e);
      }
      ctx.status = 200;
      ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
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
    ctx.cookies.set('access_token', null, {
      maxAge: 0,
      httpOnly: true,
    });
    ctx.status = 200;
  }
}
