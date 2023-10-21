import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import bcrypt from 'bcrypt';
import initializePassport from './passport-config.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import mongoose from 'mongoose';
import { User } from './database/database.js';
import antonPro from './database/antonPro.js';

const app = express();
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustertest.ypjqomh.mongodb.net/vdrs?retryWrites=true&w=majority`;

mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true })
    .then((data)=>{
        app.listen(process.env.PORT_NUMBER, ()=>console.log(`Listening on port ${process.env.PORT_NUMBER}`))
    })
    .catch(err=>console.log(err));


initializePassport(
    passport,
    async (username) => await User.findById(username),
    async (id) => await User.findById(id)
);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.post('/signUp', async (req,res)=>{ 
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
                res.json({valid: true, username: req.user.username, gender: req.user.gender });
            }
        });
    }catch(e){
        console.log(e);
    }
})
