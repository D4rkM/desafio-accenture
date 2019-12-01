import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';

import factory from '../factories';

describe('User', () => {
    beforeAll(async () => {
        await mongoose.connect(
            process.env.MONGO_URI,
            { useNewUrlParser: true, useCreateIndex: true },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            }
        );
    });

    let user = null;
    let token = null;
    let uuid = null;

    it('Should be able to register', async done => {
        user = await factory.attrs('User');

        const response = await request(app)
            .post('/sign-up')
            .send(user);

        expect(response.status).toBe(201);
        done();
    });

    it('Should not be able to register with duplicated email', async done => {
        const response = await request(app)
            .post('/sign-up')
            .send(user);

        expect(response.status).toBe(400);
        done();
    });

    it('Should be able to authenticate', async done => {
        const response = await request(app)
            .post('/sign-in')
            .send({
                email: user.email,
                senha: user.senha,
            });
        token = response.body.token;
        uuid = response.body.user._id;
        expect(response.status).toBe(200);
        done();
    });

    it('Should not be able to authenticate if email is not registerd', async done => {
        const response = await request(app)
            .post('/sign-in')
            .send({
                email: 'invalid@mail.com',
                senha: user.senha,
            });

        expect(response.status).toBe(401);
        done();
    });

    it('Should not be able to authenticate if password is wrong', async done => {
        const response = await request(app)
            .post('/sign-in')
            .send({
                email: user.email,
                senha: 'WrongPassword',
            });

        expect(response.status).toBe(401);
        done();
    });

    it('Should return Unauthorized if token is not provided', async done => {
        const response = await request(app)
            .get('/show/NoIdNeeded')
            .send();

        expect(response.status).toBe(401);
        done();
    });

    it('Should return Unauthorized if token is invalid', async done => {
        const response = await request(app)
            .get('/show/NoIdNeeded')
            .set({ Authorization: `Bearer InvalidToken` })
            .send();

        expect(response.status).toBe(401);
        done();
    });

    it('Should return "Expired Session" if token has expired', async done => {
        const response = await request(app)
            .get(`/show/${uuid}`)
            .set({
                Authorization: `Bearer ${process.env.EXPIRED_TOKEN}`,
            })
            .send();

        expect(response.status).toBe(401);
        done();
    });

    it('Should return a valid user when token and user_id are valid', async done => {
        const response = await request(app)
            .get(`/show/${uuid}`)
            .set({ Authorization: `Bearer ${token}` })
            .send();

        expect(response.status).toBe(200);
        done();
    });

    it('Should return an error 404 "User not found" status', async done => {
        const response = await request(app)
            .get(`/show/InvalidUserId`)
            .set({ Authorization: `Bearer ${token}` })
            .send();

        expect(response.status).toBe(404);
        done();
    });
});
