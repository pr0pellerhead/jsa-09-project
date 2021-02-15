const cfg = require('../../pkg/config');
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use(
    '/api/v1/auth',
    proxy(
        'http://localhost:10001',
        { proxyReqPathResolver: (req) => `http://localhost:10001/api/v1/auth${req.url}` }
    )
);

app.use(
    '/api/v1/storage',
    proxy(
        'http://localhost:10002',
        { proxyReqPathResolver: (req) => `http://localhost:10002/api/v1/storage${req.url}` }
    )
);

app.use(
    '/api/v1/users',
    proxy(
        'http://localhost:10003',
        { proxyReqPathResolver: (req) => `http://localhost:10003/api/v1/users${req.url}` }
    )
);

app.use(
    '/',
    proxy(
        'http://localhost:3000',
        { proxyReqPathResolver: (req) => `http://localhost:3000/${req.url}` }
    )
);

app.use('/', express.static(`${__dirname}/../../public/build`));

const PORT = process.env.PORT || cfg.get('services').proxy.port;

app.listen(PORT, err => {
    if (err) {
        return console.log(err);
    }
    console.log('Service successfully started on port', PORT);
});