const express = require('express');
const { Issuer, Strategy } = require('openid-client');
const expressSession = require('express-session');
const passport = require('passport');
const app = express();
const config = require('./config.json');
const issuer = config.keyCloak.issuer;
const client_id = config.keyCloak.client_id;
const client_secret = config.keyCloak.client_secret;
const redirect_uris = config.keyCloak.redirect_uris;
const port = config.express.port;
const secret = config.express.secret;
const email = config.email;

let memoryStore = new expressSession.MemoryStore();
app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

new Promise(async (resolve, reject) => {

    let keycloakIssuer = await Issuer.discover(issuer);
    console.log('Discovered issuer @ ', keycloakIssuer.issuer);

    const client = new keycloakIssuer.Client({
        client_id: client_id,
        client_secret: client_secret,
        redirect_uris: redirect_uris,
        response_types: ['code'],
    });

    passport.use('oidc', new Strategy({ client }, (tokenSet, userinfo, done) => {
        return done(null, tokenSet.claims());
    })
    )

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // logout request
    app.get('/logout', (req, res) => {
        res.redirect(client.endSessionUrl({
            post_logout_redirect_uri: 'http://localhost:' + port + '/logout/callback'
        }));
    });

    resolve(client);
}).catch((err) => {
    console.error(err);
});

// login request
app.get('/login', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
});

// callback route after login
app.get('/callback', (req, res, next) => {
    passport.authenticate('oidc', {
        successRedirect: '/home',
        failureRedirect: '/'
    })(req, res, next);
});

let checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

// protected route 1
app.get('/home', checkAuthenticated, (req, res) => {
    res.render('home', { isAuthenticated: req.isAuthenticated() });
});

// protected route 2
app.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', { isAuthenticated: req.isAuthenticated(), user: req.user });
});

// unprotected route
app.get('/', function (req, res) {
    res.render('index', { isAuthenticated: req.isAuthenticated() });
});

app.get('/info', function (req, res) {
    res.render('info', { isAuthenticated: req.isAuthenticated() });
});

app.get('/contact', function (req, res) {
    res.render('contact', { isAuthenticated: req.isAuthenticated() });
});

app.post('/contact', function (req, res) {
    let name = req.body.name;
    let message = req.body.message;
    let subject = req.body.subject;
    // Make the user send an email to the admin
    res.redirect('mailto:' + email + '?subject=' + subject + '&body=Name: ' + name + '\n\n' + message);
});

// logout callback
app.get('/logout/callback', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        return res.redirect('/');
    });
});

app.listen(port, function () {
    console.log('Listening at http://localhost:' + port + '/');
});