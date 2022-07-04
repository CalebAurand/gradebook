/**************Teacer Routes **********************/
//import express
const express = require('express');
// import teacher registration controller
const teacherRegCtrl = require('../controllers/teacherRegCtrl');
//define a new router for use for teachers registration router
const teacherRegRouter = new express.Router();

//import auth.js file verifyJWT functionality
const auth = require('../middleware/auth');

/*****Teacher Routes // login and Authorization*****/
//route for teacher registration
teacherRegRouter.post('/teacher-registration', auth.verifyJWT, teacherRegCtrl.registerTeacher);

//route for teacher login
/*
POST '/login' - logs a teacher in to the gradebook, verifies email and pw_hash, then confirms that email and pw_hash has role of teacher and then issues a JWT     
  takes in:
      email
      password
*/
teacherRegRouter.post('/teacher-login', auth.verifyJWT, teacherRegCtrl.teacherLogin);

//route for teachers to have their teacher Id created
teacherRegRouter.post('/createTeacherId', auth.verifyJWT, teacherRegCtrl.createTeacherId);

teacherRegRouter.get('/get-id', auth.verifyJWT, teacherRegCtrl.getTeacherId);

//export teacher registration/login router
module.exports = teacherRegRouter;