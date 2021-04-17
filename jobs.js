const router = require('express').Router({ mergeParams: true });
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { request } = require('express');

const getJob = (jobId) => {
    let job = null;
    try {
        job = fs.readFileSync(`data/jobs/${jobId}.json`, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    }
    return job;
};

const getQuery = (req) => {
    const defaultQuery = {
        states: ['US']
    };
    if (!req.body.query) return defaultQuery;
    if (!req.body.query.states) return defaultQuery;
    return req.body.query;
};
router.post('/', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'No user found' });
    const job = {
        id: uuidv4(),
        userId: req.params.userId,
        schedule: {
            second: req.body.second ? req.body.second : '*',
            minute: req.body.minute ? req.body.minute : '*',
            hour: req.body.hour ? req.body.hour : '12',
            dayOfMonth: req.body.dayOfMonth ? req.body.dayOfMonth : '*',
            dayOfWeek: req.body.dayOfWeek ? req.body.dayOfWeek : '*'
        },
        query: getQuery(req)
    };
    try {
        fs.writeFileSync(`data/jobs/${job.id}.json`, JSON.stringify(job));
    } catch (err) {
        console.error(err);
    }
    res.status(201).send(job);
});

router.get('/:id', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'User not found' });
    const job = getJob(req.params.id);
    if (job === null) return res.status(400).send({ error: 'Job not found' });
    res.status(200).send(JSON.parse(job));
});

router.get('/', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'User not found' });
    fs.readdir('data/jobs', (err, files) => {
        if (!files) return;
        const jobs = files
            .map(file => JSON.parse(fs.readFileSync(`data/jobs/${file}`, { encoding: 'utf-8' })))
            .filter(job => job.userId === req.params.userId);
        res.status(200).json(jobs);
    });
});

router.delete('/:id', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'User not found' });
    const job = getJob(req.params.id);
    if (job === null) return res.status(400).send({ error: 'Job not found' });
    try {
        fs.rmSync(`data/jobs/${req.params.id}.json`, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(204);
});

router.delete('/', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'User not found' });
    fs.readdir('data/jobs', (err, files) => {
        if (!files) return;
        const userJobs = files
            .map(file => JSON.parse(fs.readFileSync(`data/jobs/${file}`, { encoding: 'utf-8' })))
            .filter(job => job.userId === req.params.userId);
        if (userJobs.length === 0) return res.sendStatus(200);
        userJobs.forEach(job => fs.rmSync(`data/jobs/${job.id}.json`, { encoding: 'utf-8' }));
        res.sendStatus(204);
    });
});

module.exports = router;
