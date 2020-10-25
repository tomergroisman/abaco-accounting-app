const express   = require('express');
const next      = require('next');

const port = parseInt(process.env.PORT, 10) || 8008;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const currentUser = 'guest';

app.prepare().then(() => {
    const server = express();

    server.get('/', (req, res) => {
        return app.render(req, res, '/', {user: currentUser});
    });

    server.get('/new/expense', (req, res) => {
        return app.render(req, res, '/new/expense', {user: currentUser});
    });

    server.get('/new/income', (req, res) => {
        return app.render(req, res, '/new/income', {user: currentUser});
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    });
    
    server.listen(port, () => {
        console.log(`> Ready on port ${port}`)
    });
})