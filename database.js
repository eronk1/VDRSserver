import "dotenv/config.js";
import mongoose from 'mongoose';

const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustertest.ypjqomh.mongodb.net/vdrs?retryWrites=true&w=majority`;

mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('connected'))
    .catch(err=>console.log(err));