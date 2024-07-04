import { User } from '../database/database.js';
export default async function login(req,res){
    try{
        let newUser = await User.findOne({username: req.body.username});
        // console.log(newUser);
        req.login(newUser, (err) => {
            if (err) {
                res.json({valid: false, message: 'Invalid login attempt'});
            } else {
                req.session.user = { username: newUser.username };
                req.session.authenticated = true;
                res.json({valid: true, username: newUser.username, gender: newUser.gender });
            }
        });
    }catch(e){
        console.log(e);
    }
}