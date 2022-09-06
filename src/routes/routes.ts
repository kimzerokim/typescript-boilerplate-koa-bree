import Router from '@koa/router';

import UserController from '../controller/userController';

const router = new Router();

router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.get('/signout', UserController.signOut);

export { router };
