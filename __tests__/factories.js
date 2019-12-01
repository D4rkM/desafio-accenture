import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

factory.define('User', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    senha: faker.internet.password(),
    telefones: [
        {
            numero: faker.phone.phoneNumber(),
            ddd: faker.random.number(99, 1),
        },
    ],
});

export default factory;
