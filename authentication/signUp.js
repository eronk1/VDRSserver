import antonPro from '../database/antonPro.js';
import bcrypt from 'bcrypt';
import { User } from '../database/database.js';
export default async function signUp(req,res){
    try{
        let check = antonPro(req.body);
        if(!check.valid){
            res.json(check)
            return;
        };
        let password = await bcrypt.hash(req.body.password,10);
        let user = {
            username: req.body.username,
            password: password,
            gender: req.body.gender
        };
        let newUser = new User(user)
        newUser.save();
        req.login(newUser, (err) => {
            if (err) {
                res.json({valid: false, message: 'Something went wrong'});
            } else {
                req.session.user = { username: newUser.username };
                req.session.authenticated = true;
                res.json({valid: true, username: req.user.username, gender: req.user.gender });
            }
        });
    }catch(e){
        console.log(e);
    }
}