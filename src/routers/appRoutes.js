/**This file will hold the functions "routes" for the gradebook application */
//import express
const express = require('express');

//create an express router
const router = new express.Router();

//import controller for app 
const appController = require('../controllers/appControllers');

//import middlware for app
const auth = require('../middleware/auth');

//route for average value of homework
router.get('/hw-average', appController.homeworkAverage);

//route for average value of quizzes
router.get('/quizzes-average', appController.quizzesAverage);

//route for average value of projects
router.get('/projects-average', appController.projectsAverage);

//route for average value of tests
router.get('/tests-average', appController.testsAverage);

//route for GPA
// router.get('/gpa', /**Middleware */, /**imported function */);

//export the router
module.exports = router;