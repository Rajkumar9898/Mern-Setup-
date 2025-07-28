const passport = require('passport'); // Import passport for authentication
const localStrategy = require('passport-local').Strategy; // Import local strategy for passport
const Person = require('./models/Person'); // Import Person model 

passport.use(new localStrategy(async (username, password, done) => {
    try {
        // console.log(`Authenticating user: ${username}, ${password}`);
        const person = await Person.findOne({ username });
        if (!person) {
            return done(null, false, { message: 'Invalid username' });
        }
        const isPasswordValid = await person.comparePassword(password);
        if (isPasswordValid) {
            return done(null, person);
        } else {
            return done(null, false, { message: 'Invalid password' });
        }
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport;