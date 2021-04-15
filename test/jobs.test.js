const request = require('supertest');
const app = require('../app');
const fs = require('fs');

describe('Jobs', () => {
    let user;
    beforeEach(async () => {
        user = (await request(app).post('/users')).body;
    });
    afterEach(async () => {
        await request(app).delete(`/users/${user.id}`);
    });
    describe('POST /jobs', async () => {
        it('returns 400 when user not found', async () => {
            await request(app)
                .post('/jobs')
                .send({})
                .expect(400, { error: 'No user found' });
        });
        it('returns 201 with default cron job configuration when job created', async () => {
            await request(app)
                .post('/jobs')
                .send({ userId: user.id })
                .expect(201, {
                    second: '*',
                    minute: '*',
                    hour: '12',
                    dayOfMonth: '*',
                    dayOfWeek: '*'
                });
        });
        it('returns config with desired second', async () => {
            await request(app)
                .post('/jobs')
                .send({
                    userId: user.id,
                    second: '30'
                })
                .expect(201, {
                    second: '30',
                    minute: '*',
                    hour: '12',
                    dayOfMonth: '*',
                    dayOfWeek: '*'
                });
        });
        it('returns config with desired minute', async () => {
            await request(app)
                .post('/jobs')
                .send({
                    userId: user.id,
                    minute: '34'
                })
                .expect(201, {
                    second: '*',
                    minute: '34',
                    hour: '12',
                    dayOfMonth: '*',
                    dayOfWeek: '*'
                });
        });
        it('returns config with desired hour', async () => {
            await request(app)
                .post('/jobs')
                .send({
                    userId: user.id,
                    hour: '8'
                })
                .expect(201, {
                    second: '*',
                    minute: '*',
                    hour: '8',
                    dayOfMonth: '*',
                    dayOfWeek: '*'
                });
        });
        it('returns config with desired day of month', async () => {
            await request(app)
                .post('/jobs')
                .send({
                    userId: user.id,
                    dayOfMonth: '20'
                })
                .expect(201, {
                    second: '*',
                    minute: '*',
                    hour: '12',
                    dayOfMonth: '20',
                    dayOfWeek: '*'
                });
        });
        it('returns config with desired day of week', async () => {
            await request(app)
                .post('/jobs')
                .send({
                    userId: user.id,
                    dayOfWeek: '3'
                })
                .expect(201, {
                    second: '*',
                    minute: '*',
                    hour: '12',
                    dayOfMonth: '*',
                    dayOfWeek: '3'
                });
        });
    });
});