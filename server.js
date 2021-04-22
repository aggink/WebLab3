const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: 'Mysecret',
        store: new FileStore(),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: false

    })
);

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));


const routes = require('./routes/route.js');
routes(app);

// Start the server
const server = app.listen(port, (error) => {
    if(error){
        return console.log(`Error: ${error}`);
    }
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('Welcome!!!!!');
})