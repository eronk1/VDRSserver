import "dotenv/config.js";
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema =  new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const User = mongoose.model('users', userSchema);