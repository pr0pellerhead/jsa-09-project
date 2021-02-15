const cfg = require('../../pkg/config');
const express = require('express');
const jwt = require('express-jwt');
const upload = require('express-fileupload');

const storage = require('./handlers/storage');

const api = express();

api.use(jwt({
    secret: cfg.get('security').jwt_key,
    algorithms: ['HS256']
}));

api.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Bad Token');
    }
});

api.use(upload());

api.post('/api/v1/storage', storage.uploadFile);
api.get('/api/v1/storage/:file', storage.getFile);

api.listen(cfg.get('services').storage.port, err => {
    if (err) {
        return console.log(err);
    }
    console.log('Service successfully started on port', cfg.get('services').storage.port);
})