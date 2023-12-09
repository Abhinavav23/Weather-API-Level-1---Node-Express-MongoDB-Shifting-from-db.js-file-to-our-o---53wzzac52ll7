const express = require('express');
const app = express();
const router = require('../routes/index');

app.use(express.json());

app.use('/api/v1/', router);

module.exports = app;


// localhost:3000/api/v1/auth/signup
// localhost:3000/api/v1/auth/login
// localhost:3000/api/v1/auth/decode