import request from 'supertest';

import { dataSource } from '@/dataSource';
import { User } from '@/entity/User';

import { createApp } from '@/app';
import { encodeJWT } from '@/utils/authTokenUtil';

export class TestUtil {
  public app = createApp();
  public dataSource = dataSource;

  public setupDB() {
    beforeAll(async () => {
      await dataSource.initialize();
    });

    beforeEach(async () => {
      await dataSource.dropDatabase();
      await dataSource.synchronize();
    });

    afterAll(async () => {
      await dataSource.destroy();
    });
  }

  public async authedGet(user: User | string, url: string) {
    return this._get(user, url);
  }

  public async authedPost(user: User | string, url: string, body?: string | object) {
    return this._post(user, url, body);
  }

  public async authedPostForm(
    user: User | string,
    url: string,
    fields: { [key: string]: string },
    files?: { [key: string]: string }
  ) {
    let r = request(await this.getAppCallback())
      .post(url)
      .set(await this.getAuthHeader(user));

    for (const key of Object.keys(fields)) {
      r = r.field(key, fields[key]);
    }

    if (files) {
      for (const key of Object.keys(files)) {
        r = r.attach(key, files[key]);
      }
    }

    return r;
  }

  public async authedDel(user: User | string, url: string) {
    return request(await this.getAppCallback())
      .del(url)
      .set(await this.getAuthHeader(user));
  }

  public async unauthedGet(url: string) {
    return this._get(null, url);
  }

  public async unauthedPost(url: string, body?: object) {
    return this._post(null, url, body);
  }

  private async getAuthHeader(user: User | string) {
    return {
      authorization: await encodeJWT(typeof user === 'string' ? { email: user } : { email: user.email }),
    };
  }

  private async getAppCallback() {
    return (await this.app).callback();
  }

  private async _get(user: User | string, url: string) {
    let basicRequest = request(await this.getAppCallback()).get(url);

    if (user) {
      basicRequest = basicRequest.set(await this.getAuthHeader(user));
    }

    return basicRequest;
  }

  private async _post(user: User | string, url: string, body?: string | object) {
    let basicRequest = request(await this.getAppCallback()).post(url);

    if (user) {
      basicRequest = basicRequest.set(await this.getAuthHeader(user));
    }

    if (body) {
      return basicRequest.send(body);
    }
    return basicRequest;
  }
}
