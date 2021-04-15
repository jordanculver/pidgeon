const router = require('express').Router();
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

router.post('/', (req, res) => {
    const user = getUser(req.body.userId);
    if (user === null) return res.status(400).send({ error: 'No user found' });
    res.status(201)
        .send({
            second: req.body.second ? req.body.second : '*',
            minute: req.body.minute ? req.body.minute : '*',
            hour: req.body.hour ? req.body.hour : '12',
            dayOfMonth: req.body.dayOfMonth ? req.body.dayOfMonth : '*',
            dayOfWeek: req.body.dayOfWeek ? req.body.dayOfWeek : '*'
        });
});

// router.get('/:id', (req, res) => {
//     let user = null;
//     try {
//         user = fs.readFileSync(`data/users/${req.params.id}.json`, { encoding: 'utf-8' });
//     } catch (err) {
//         console.error(err);
//     }
//     res.sendStatus(user !== null ? 200 : 400);
// });

// router.delete('/:id', (req, res) => {
//     try {
//         fs.rmSync(`data/users/${req.params.id}.json`, { encoding: 'utf-8' });
//     } catch (err) {
//         res.sendStatus(400);
//         console.error(err);
//     }
//     res.sendStatus(200);
// });

module.exports = router
