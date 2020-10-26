const express   = require('express');
const next      = require('next');
const mysql = require('mysql');

const port = parseInt(process.env.PORT, 10) || 8008;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const pool = mysql.createPool({
    host     : 'squid-productions.com',
    user     : 'u376134960_admin',
    password : 'tGG0706a',
    database : 'u376134960_accounting_app'
  });

const currentUser = 'guest';

app.prepare().then(() => {
    const server = express();

    server.get('/', (req, res) => {
        return app.render(req, res, '/', {user: currentUser});
    });

    server.get('/expense/new', (req, res) => {
        return app.render(req, res, '/expense/new', {user: currentUser});
    });
    server.get('/expense/:_id', (req, res) => {
        const { _id } = req.params;
        return app.render(req, res, '/expense/[_id]', {user: currentUser, _id: _id});
    });

    server.get('/income/new', (req, res) => {
        return app.render(req, res, '/income/new', {user: currentUser});
    });
    server.get('/income/:_id', (req, res) => {
        const { _id } = req.params;
        return app.render(req, res, '/income/[_id]', {user: currentUser, _id: _id});
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });
    
    server.listen(port, () => {
        console.log(`> Ready on port ${port}`)
    });
})