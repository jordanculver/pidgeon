const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const port = 3892;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users', (req, res) => {
    const user = { id: uuidv4() };
    try {
        fs.writeFileSync(`data/users/${user.id}.json`, JSON.stringify(user));
    } catch (err) {
        console.error(err);
    }
    res.status(201).send(user);
});

app.get('/users/:id', (req, res) => {
    let user = null;
    try {
        user = fs.readFileSync(`data/users/${req.params.id}.json`, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(user !== null ? 200 : 400);
});

let server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = server;
