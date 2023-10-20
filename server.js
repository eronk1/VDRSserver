import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import bcrypt from 'bcrypt';
const app = express();
const users = [];

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true, // If your requests include credentials
}));

app.post('/signUp',async (req,res)=>{ 
    try{
        let password = await bcrypt.hash(req.body.inputPassword,10);
        users.push({
            id: Math.round(Math.random()*1000000),
            username: req.body.inputUsername,
            password: password,
            gender: req.body.inputGender
        })
    }catch(e){
        console.log(e);
    }
    res.json(users[0])
})

app.listen(process.env.PORT_NUMBER, ()=>console.log(`Listening on port ${process.env.PORT_NUMBER}`))