import { Repository } from 'typeorm';

import { dataSource } from '@/dataSource';
import { User } from '@/entity/User';
import { TestUtil } from '@/test_utils';

describe('test /user', () => {
  const util = new TestUtil();
  util.setupDB();

  it('tests /signup', async () => {
    const email = 'test@test.com';
    const password = 'test';

    const resp = await util.unauthedPost('/signup', {
      email,
      password,
    });

    expect(resp.status).toBe(200);
    expect(resp.header).toMatchObject({
      authorization: expect.any(String),
    });
    expect(resp.body).toMatchObject({
      success: true,
      payload: {
        email,
      },
    });
  });

  it('tests /signin', async () => {
    const email = 'test@test.com';
    const password = 'test';

    const userRepository: Repository<User> = dataSource.getRepository(User);
    const user = new User();
    user.email = email;
    user.password = password;
    await userRepository.save(user);

    const resp = await util.unauthedPost('/signin', {
      email: email,
      password,
    });

    expect(resp.status).toBe(200);
    expect(resp.header).toMatchObject({
      authorization: expect.any(String),
    });
    expect(resp.body).toMatchObject({
      success: true,
      payload: {
        email,
      },
    });
  });

  it('tests /signout', async () => {
    const email = 'test@test.com';
    const password = 'test';

    const userRepository: Repository<User> = dataSource.getRepository(User);
    const user = new User();
    user.email = email;
    user.password = password;
    await userRepository.save(user);

    const resp = await util.authedGet(user, '/signout');

    expect(resp.status).toBe(204);
    expect(resp.header).not.toMatchObject({
      authorization: expect.any(String),
    });
  });
});
