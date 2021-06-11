const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true

}, async (req, username, password, done) => {
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    console.log(result);
}));

/* password.serializeUser((usr, done) => {

}); */
