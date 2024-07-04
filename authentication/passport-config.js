import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
const LocalStrategy = passportLocal.Strategy;

export default async function initalize(passport, getUserByUsername, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        // console.log(await user);
        if (!user){
            return done(null, false, {message: 'Incorrect username'});
        }

        try{
            if(await bcrypt.compare(password, await user.password)){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect password'});
            }
        } catch(e){
            console.log('hi');
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