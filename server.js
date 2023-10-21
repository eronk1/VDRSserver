import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import bcrypt from 'bcrypt';
import initializePassport from './passport-config.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import mongoose from 'mongoose';

const app = express();
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustertest.ypjqomh.mongodb.net/vdrs?retryWrites=true&w=majority`;
const users = [];

mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true })
    .then((data)=>{
        console.log(data)
        app.listen(process.env.PORT_NUMBER, ()=>console.log(`Listening on port ${process.env.PORT_NUMBER}`))
    })
    .catch(err=>console.log(err));


initializePassport(
    passport,
    (username) => users.find(user => user.username === username),
    (id) => users.find(user => user.id === id)
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
        let password = await bcrypt.hash(req.body.inputPassword,10);
        let newUser = {
            id: Date.now().toString(),
            username: req.body.inputUsername,
            password: password,
            gender: req.body.inputGender
        }
        users.push(newUser)
        req.login(newUser, (err) => {
            if (err) {
                console.log(err);
                res.json({loggedIn: false});
            } else {
                console.log(req.user);
                res.json({loggedIn: true, username: req.user.username, gender: req.user.gender });
            }
        });
    }catch(e){
        console.log(e);
    }
})
