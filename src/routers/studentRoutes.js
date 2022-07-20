/*****Student Routes*****/
//import express
const express = require('express');
//define a new router for use for student registration router
const studentRouter = new express.Router();

// import student registration controller
const studentController = require('../controllers/studentControllers');

//bring in the studentRegistrationController to use the getStudentId function
const studentRegController = require('../controllers/studentRegCtrl');

//import auth middlware to verify jwt
const auth = require('../middleware/auth');

//GET '/studentGrades' - returns a list of the students assignments and the associated grades
studentRouter.get('/student-tests', auth.verifyJWT, studentRegController.getStudentId, studentController.allTests);

studentRouter.get('/student-quizzes', auth.verifyJWT, studentRegController.getStudentId, studentController.allQuizzes);

//GET '/studentGrade/:id' - gives the details and any comments or notes that the teacher wrote on the student's individual assignment-grade
studentRouter.get('/student-grade/:id', auth.verifyJWT, studentRegController.getStudentId, studentController.getGrade);

//do one for all grades for that student id - coming soon
// studentRouter.get('/student-grades', auth.verifyJWT, studentController.getGrades);

//do one for homework

//do one for projects

//PUT '/student/:id' - (protected route) allows a student to update their password

//POST*****students do not have access to create new students*****
//PUT*****students do not have access to update email, name, or class associations*****
//DELETE*****students do not have access to delete their profile, or other students'*****

//DELETE '/student/:id' (protected route) allows a teacher to delete a student record from the students table, and from the users table **if authorized**

module.exports = studentRouter;