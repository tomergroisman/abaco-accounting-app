const express           = require('express');
const next              = require('next');
const session           = require('express-session');
const passport          = require('passport');
const Auth0Strategy     = require('passport-auth0');


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const currentUser = "guest";

app.prepare().then(() => {
    const server = express();
    const auth0Strategy = new Auth0Strategy(
        {
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: process.env.REDIRECT_URI,
            passReqToCallback: true
        },
        function (accessToken, refreshToken, extraParams, profile, done) {
            // accessToken is the token to call Auth0 API (not needed in the most cases)
            // extraParams.id_token has the JSON Web Token
            // profile has all the information from the user
            return done(null, profile);
        }
    );
    passport.use(auth0Strategy);
    const sess = {
        secret: 'Abra Kadabra',
        cookie: {},
        resave: false,
        saveUninitialized: true
    };
      
    if (server.get('env') === 'production') {
        // Use secure cookies in production (requires SSL/TLS)
        sess.cookie.secure = true;
        
        // Uncomment the line below if your application is behind a proxy (like on Heroku)
        // or if you're encountering the error message:
        // "Unable to verify authorization request state"
        // app.set('trust proxy', 1);
    }
    server.use(session(sess));
    server.use(passport.initialize());
    server.use(passport.session());

    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    function secured(req, res, next) {
        console.log(req.user)
        return next();
        // if (req.user) return next();
        // req.session.returnTo = req.originalUrl;
        // res.redirect('/api/login');
    };

    server.get('/', secured, (req, res) => {
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