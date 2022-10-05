//import express, dotenv, bodyparser, and choose which port to run on locally or set it variably
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

//downloaded and using cors package for network cors security errors
const cors = require('cors');

//establish PORT app is to run on
const PORT = process.env.PORT || 8500;

//create a new express method for our server, assigned to the app variable
let app = new express();

//tell app to use cors package for network security errors
app.use(cors({
  origin: ['http://localhost:3000']
}));

// tell the app to use the bodyParser.json() method to be able to read json
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.json({
//   type: ['application/json', 'text/plain']
// }))
app.use(bodyParser.urlencoded({ extended: false }))



//tell the app to use basic routes for the application
let appRouter = require('./routers/appRoutes');
app.use(appRouter);

//create a variable to access the exported routes for teacher registration and login
//tell the app to use these routes for teacher registration and login
let teacherRegRouter = require('./routers/teacherRegRt');
app.use(teacherRegRouter);

//create a variable to access the exported routes for teachers to use
//tell the app to use the routes for teachers
let teacherRouter = require('./routers/teacherRoutes');
app.use(teacherRouter);

//create a variable to access the exported routes for student registration and login
//tell the app to use the routes for student registration and login
let studentRegRouter = require('./routers/studentRegRt');
app.use(studentRegRouter);



//create a variable to access the exported routes for students to use
//tell the app to use the routes for students
let studentRouter = require('./routers/studentRoutes');
app.use(studentRouter);


app.listen(PORT, function(){
  console.log('server started listening on port ', PORT);
});