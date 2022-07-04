/*****Student Registration Routes*****/

//import express
const express = require('express');
//define a new router for use for student registration router
const studentRegRouter = new express.Router();

// import student registration controller
const studentRegController = require('../controllers/studentRegCtrl');

//import auth middlware to verify jwt
const auth = require('../middleware/auth');

//route for student registration
/*POST '/registerStudent' - registers a new student to the gradebook app 
  takes in: 
    name VARCHAR(50)
    email VARCHAR(60)
    password >>>turned into a password hash

  then creates a new user in the users table with role of student
*/
studentRegRouter.post('/student-registration', studentRegController.registerStudent);


//route for student login
/*POST '/studentlogin'- allows a student to login to see their grades / assignments
  takes in:
    email
    password

  if successful:
    returns a JWT with the student id attached
*/
studentRegRouter.post('/student-login', auth.verifyJWT, studentRegController.studentLogin);

/* route for creating a student Id
adds the new user to the students table, 
    and links the userid as a foreign key on the students table*/
studentRegRouter.post('/create-studentId', auth.verifyJWT, studentRegController.createStudentId);

//export student registration/login router
module.exports = studentRegRouter;