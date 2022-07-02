//import express, dotenv, bodyparser, and choose which port to run on locally or set it variably
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

//establish PORT app is to run on
const PORT = process.env.PORT || 8500;

//create a new express method for our server, assigned to the app variable
let app = new express();
// tell the app to use the bodyParser.json() method to be able to read json
app.use(bodyParser.json());

//tell the app to use basic routes for the application
let appRouter = require('./routers/appRoutes');
app.use(appRouter);

//create a variable to access the exported routes for teacher registration and login

//tell the app to use these routes for teacher registration and login

//create a variable to access the exported routes for student registration and login

//tell the app to use the routes for student registration and login
let studentRegRouter = require('./routers/studentRegRt');
app.use(studentRegRouter);
//create a variable to access the exported routes for teachers to use

//tell the app to use the routes for teachers

//create a variable to access the exported routes for students to use

//tell the app to use the routes for students



app.listen(PORT, function(){
  console.log('server started listening on port ', PORT);
});