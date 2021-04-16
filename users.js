const router = require('express').Router();
const jobs = require('./jobs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const getUser = (userId) => {
    let user = null;
    try {
        user = fs.readFileSync(`data/users/${userId}.json`, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    }
    return user;
};

router.use('/:userId/jobs', (req, res, next) => {
    req.body.user = getUser(req.params.userId);
    next();
}, jobs);

router.post('/', (req, res) => {
    const user = { id: uuidv4() };
    try {
        fs.writeFileSync(`data/users/${user.id}.json`, JSON.stringify(user));
    } catch (err) {
        console.error(err);
    }
    res.status(201).send(user);
});

router.get('/:id', (req, res) => {
    let user = null;
    try {
        user = fs.readFileSync(`data/users/${req.params.id}.json`, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(user !== null ? 200 : 400);
});

router.delete('/:id', (req, res) => {
    try {
        fs.rmSync(`data/users/${req.params.id}.json`, { encoding: 'utf-8' });
    } catch (err) {
        res.sendStatus(400);
        console.error(err);
    }
    res.sendStatus(200);
});

module.exports = router;
