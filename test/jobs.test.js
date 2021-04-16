const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const fs = require('fs');

describe('Jobs', () => {
    let user;
    const deleteJobs = () => {
        fs.readdir('data/jobs', (err, files) => {
            if (files) files.forEach(file => fs.rmSync(`data/jobs/${file}`));
        });
    };
    beforeEach(async () => {
        user = (await request(app).post('/users')).body;
    });
    afterEach(async () => {
        await request(app).delete(`/users/${user.id}`);
        deleteJobs();
    });
    describe('POST /users/:id/jobs', async () => {
        it('returns 400 when user not found', async () => {
            await request(app)
                .post('/users/1/jobs')
                .send({})
                .expect(400, { error: 'No user found' });
        });
        it('returns id', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .expect(201);
            expect(job.body.id).to.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/);
        });
        it('returns user id', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .expect(201);
            expect(job.body.userId).to.equal(user.id);
        });
        it('returns different ids for same user', async () => {
            const res1 = await request(app)
                .post(`/users/${user.id}/jobs`);
            const res2 = await request(app)
                .post(`/users/${user.id}/jobs`);
            expect(res1.body.id).to.not.equal(res2.body.id);
        });
        it('returns 201 with default cron job configuration when job created', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .expect(201);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired second', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    second: '30'
                })
                .expect(201);
            expect(job.body.second).to.equal('30');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired minute', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    minute: '34'
                })
                .expect(201);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('34');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired hour', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    hour: '8'
                })
                .expect(201);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('8');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired day of month', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    dayOfMonth: '20'
                })
                .expect(201);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('20');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired day of week', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    dayOfWeek: '3'
                })
                .expect(201);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('3');
        });
    });
    describe('GET /users/:userId/jobs/:id', async () => {
        it('returns 400 when user not found', async () => {
            await request(app)
                .get(`/users/2/jobs/1`)
                .expect(400, { error: 'User not found' });
        });
        it('returns 400 when job not found', async () => {
            await request(app)
                .get(`/users/${user.id}/jobs/1`)
                .expect(400, { error: 'Job not found' });
        });
        it('returns 200 with cron job configuration', async () => {
            const created = await request(app)
                .post(`/users/${user.id}/jobs/`)
                .expect(201);
            const job = await request(app)
                .get(`/users/${user.id}/jobs/${created.body.id}`)
                .expect(200);
            expect(job.body.userId).to.equal(user.id);
            expect(job.body.second).to.equal('*');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
        it('returns config with desired second', async () => {
            const created = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    second: '30'
                })
                .expect(201);
            const job = await request(app)
                .get(`/users/${user.id}/jobs/${created.body.id}`)
                .expect(200);
            expect(job.body.second).to.equal('30');
            expect(job.body.minute).to.equal('*');
            expect(job.body.hour).to.equal('12');
            expect(job.body.dayOfMonth).to.equal('*');
            expect(job.body.dayOfWeek).to.equal('*');
        });
    });
});