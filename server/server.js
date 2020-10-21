const express   = require('express');
const next      = require('next');

const port = parseInt(process.env.PORT, 10) || 8008;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.get('/', (req, res) => {
        return app.render(req, res, '/', {user: 'guest'});
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    });
    
    server.listen(port, () => {
        console.log(`> Ready on port ${port}`)
    });
})