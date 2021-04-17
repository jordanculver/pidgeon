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
    describe('POST /users/:userId/jobs', async () => {
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
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
        it('returns config with desired second', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    second: '30'
                })
                .expect(201);
            expect(job.body.schedule.second).to.equal('30');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
        it('returns config with desired minute', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    minute: '34'
                })
                .expect(201);
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('34');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
        it('returns config with desired hour', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    hour: '8'
                })
                .expect(201);
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('8');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
        it('returns config with desired day of month', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    dayOfMonth: '20'
                })
                .expect(201);
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('20');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
        it('returns config with desired day of week', async () => {
            const job = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    dayOfWeek: '3'
                })
                .expect(201);
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('3');
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
            expect(job.body.schedule.second).to.equal('*');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
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
            expect(job.body.schedule.second).to.equal('30');
            expect(job.body.schedule.minute).to.equal('*');
            expect(job.body.schedule.hour).to.equal('12');
            expect(job.body.schedule.dayOfMonth).to.equal('*');
            expect(job.body.schedule.dayOfWeek).to.equal('*');
        });
    });
    describe('GET /users/:userId/jobs', async () => {
        let createdJobs;
        beforeEach(async () => {
            const job1 = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    second: '30'
                });
            const job2 = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    minute: '32'
                });
            createdJobs = Array.of(job1.body, job2.body);
        });
        it('returns list of jobs associated with user', async () => {
            const jobs = await request(app)
                .get(`/users/${user.id}/jobs`)
                .expect(200);
            expect(jobs.body.length).to.equal(2);
            const jobIds = jobs.body.map(job => job.id);
            expect(jobIds).to.contain(createdJobs[0].id);
            expect(jobIds).to.contain(createdJobs[1].id);
        });
        it('returns 400 bad request when user not found', async () => {
            await request(app)
                .get(`/users/1/jobs`)
                .expect(400, { error: 'User not found' });
        });
        it('returns empty list of jobs when user has no jobs', async () => {
            const newUser = await request(app).post('/users');
            const jobs = await request(app)
                .get(`/users/${newUser.body.id}/jobs`)
                .expect(200);
            expect(jobs.body.length).to.equal(0);
        });
    });
    describe('DELETE /users/:userId/jobs/:id', async () => {
        let job;
        beforeEach(async () => {
            job = (await request(app).post(`/users/${user.id}/jobs`)).body;
        });
        it('returns 400 bad request when user not found', async () => {
            await request(app)
                .delete(`/users/1/jobs/${job.id}`)
                .expect(400, { error: 'User not found' });
        });
        it('returns 400 bad request when job not found', async () => {
            await request(app)
                .delete(`/users/${user.id}/jobs/1`)
                .expect(400, { error: 'Job not found' });
        });
        it('removes job from database', async () => {
            await request(app)
                .get(`/users/${user.id}/jobs/${job.id}`)
                .expect(200);
            await request(app)
                .delete(`/users/${user.id}/jobs/${job.id}`)
                .expect(204);
            await request(app)
                .get(`/users/${user.id}/jobs/${job.id}`)
                .expect(400, { error: 'Job not found' });
        });
    });
    describe('DELETE /users/:userId/jobs', async () => {
        let createdJobs;
        beforeEach(async () => {
            const job1 = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    second: '30'
                });
            const job2 = await request(app)
                .post(`/users/${user.id}/jobs`)
                .send({
                    minute: '32'
                });
            createdJobs = Array.of(job1.body, job2.body);
        });
        it('returns 400 bad request when user not found', async () => {
            await request(app)
                .delete(`/users/1/jobs`)
                .expect(400, { error: 'User not found' });
        });
        it('returns 200 when jobs not found', async () => {
            const newUser = await request(app).post('/users');
            await request(app)
                .delete(`/users/${newUser.body.id}/jobs`)
                .expect(200);
        });
        it('removes all jobs associated with user from database', async () => {
            const jobs = await request(app)
                .get(`/users/${user.id}/jobs`)
                .expect(200);
            expect(jobs.body.length).to.equal(2);
            await request(app)
                .delete(`/users/${user.id}/jobs`)
                .expect(204);
            const emptyJobs = await request(app)
                .get(`/users/${user.id}/jobs`)
                .expect(200);
            expect(emptyJobs.body.length).to.equal(0);
        });
    });
});