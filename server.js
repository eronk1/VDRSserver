import http from 'http';
import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import initializePassport from './passport-config.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import mongoose from 'mongoose';
import { User } from './database/database.js';
import signUp from './authentication/signUp.js';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: ['http://localhost:5173']
    }
});

const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustertest.ypjqomh.mongodb.net/vdrs?retryWrites=true&w=majority`;

mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true })
    .then((data)=>{
        server.listen(process.env.PORT_NUMBER, ()=>console.log(`Listening on port ${process.env.PORT_NUMBER}`))
    })
    .catch(err=>console.log(err));

initializePassport(passport, async (username) => await User.findById(username),async (id) => await User.findById(id));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({secret: process.env.SESSION_SECRET,resave: false,saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({origin: 'http://localhost:5173',credentials: true}));

app.post('/signUp', async (req,res)=> await signUp(req,res));


io.on('connection', socket => {
    console.log('A user connected'+socket.id);
    socket.on('disconnect',()=>{
        console.log('A user disconnected');
    })
})