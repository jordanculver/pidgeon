const express = require('express');
const users = require('./users');
const app = express();
const port = 3892;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', users);

let server = app.listen(port, () => {
    console.log(`pigeon listening at http://localhost:${port}`);
});

module.exports = server;
