//! When using TS on the backend, use ES6 style imports: 
// require('dotenv').config(); 
import dotenv from 'dotenv';
dotenv.config()
// const express = require('express');
import express from 'express';
// const session = require('express-session');
import session from 'express-session';
import mongoose from 'mongoose';
import passport from './config/ppConfig';

const app = express(); 

app.use(express.static(__dirname + '/../client/build/'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('view engine', 'ejs');

//! Mongoose connection string needs to be typed as string
mongoose.connect(process.env.MONGODB_URI as string) //? if we need URL parser true we set that as a second parameter
const db = mongoose.connection; 

//! Connection types don't seem to support db.host or db.port
db.once('open', () => {
    console.log("Connected to monogo at probably the right place");
});
db.on('error', (err) => {
    console.log("An error has occured:", err)
});

//* Configure the express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

//* Configure the passport middleware
app.use(passport.initialize()); 
app.use(passport.session());

import authRouter from './routes/auth'; 
//allowed to call it authRouter (something else) because it has something to do 
//with named vs. default exports
//if {authRouter} it wouldn't work unless it was called authRouter

app.use('/auth', authRouter);

import apiRouter from './routes/api';

app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile('index.html');
});

app.listen(process.env.PORT || 3000);