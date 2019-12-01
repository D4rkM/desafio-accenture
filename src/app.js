import './bootstrap';
import express from 'express';
import cors from 'cors';

import './database/index';
import routes from './routes';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(cors());
        this.server.disable('x-powered-by');
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
