import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sign-up', UserController.store);
routes.post('/sign-in', SessionController.store);
routes.get('/show/:user_id', auth, UserController.show);

export default routes;
