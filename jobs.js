const router = require('express').Router({ mergeParams: true });
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

router.post('/', (req, res) => {
    if (req.body.user === null) return res.status(400).send({ error: 'No user found' });
    res.status(201)
        .send({
            id: uuidv4(),
            userId: req.params.userId,
            second: req.body.second ? req.body.second : '*',
            minute: req.body.minute ? req.body.minute : '*',
            hour: req.body.hour ? req.body.hour : '12',
            dayOfMonth: req.body.dayOfMonth ? req.body.dayOfMonth : '*',
            dayOfWeek: req.body.dayOfWeek ? req.body.dayOfWeek : '*'
        });
});

module.exports = router;
