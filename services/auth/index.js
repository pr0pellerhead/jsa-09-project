const config = require('../../pkg/config');
require('../../pkg/db');
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./handlers/auth');
const jwt = require('express-jwt');

const api = express();
api.use(bodyParser.json());
api.use(jwt({
    secret: config.get('security').jwt_key,
    algorithms: ['HS256']
}).unless({
    path: [
        '/api/v1/auth/create-account',
        '/api/v1/auth/login'
    ]
}));
api.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Bad Token');
    }
});

api.post('/api/v1/auth/create-account', auth.createAccount);
api.post('/api/v1/auth/login', auth.login);
api.get('/api/v1/auth/refresh-token', auth.refreshToken);

api.listen(config.get('services').auth.port, err => {
    if (err) {
        console.log(err);
    }
    console.log('Server successfully started on port', config.get('services').auth.port);
});