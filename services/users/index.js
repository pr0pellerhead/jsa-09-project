const config = require('../../pkg/config');
require('../../pkg/db');
const express = require('express');
const bodyParser = require('body-parser');
const users = require('./handlers/users');
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

api.get('/api/v1/users', users.getAll);
api.get('/api/v1/users/:id', users.getOne);
api.post('/api/v1/users', users.create);
api.put('/api/v1/users/:id', users.update);
api.patch('/api/v1/users/:id', users.updatePartial);
api.delete('/api/v1/users/:id', users.remove);

api.listen(config.get('services').users.port, err => {
    if (err) {
        console.log(err);
    }
    console.log('Server successfully started on port', config.get('services').users.port);
});