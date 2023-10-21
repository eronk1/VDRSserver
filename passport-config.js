import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
const LocalStrategy = passportLocal.Strategy;

export default function initalize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username);
        if (!user){
            return done(null, false, {message: 'Incorrect username'});
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect password'});
            }
        } catch(e){
            console.log(e);
        }
    }
    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}