const express = require('express');
const users = require('./users');
const jobs = require('./jobs');
const app = express();
const port = 3892;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', users);
app.use('/jobs', jobs);

let server = app.listen(port, () => {
    console.log(`pigeon listening at http://localhost:${port}`);
});

module.exports = server;
