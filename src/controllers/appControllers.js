/**This file will hold the functions "controls" for the gradebook application */
//import the db
const db = require('../model/db');

//calculate sum value of tests

//calculate sum value of projects

//calculate sum value of quizzes

//calculate sum value of homework


//calculate weight value of tests

//calculate weight value of projects

//calculate weight value of quizzes

//calculate weight value of homework


//calc average of tests
let testsAverage = (req, res) => {
  console.log('testsAverage');
  db.query("select now()", function(err, result){
    if(err){
      console.log("Could not connect to db", err)
      res.sendStatus(500);
    } else {
      console.log("Connected to db", result)
      res.send(result);
    }}
    );
};
//calc average of projects
let projectsAverage = (req, res) => {
  console.log('projectsAverage');
  db.query("select now()", function(err, result){
    if(err){
      console.log("Could not connect to db", err)
      res.sendStatus(500);
    } else {
      console.log("Connected to db", result)
      res.send(result);
    }}
    );
};
//calc average of tests
let quizzesAverage = (req, res) => {
  console.log('quizzesAverage');
  db.query("select now()", function(err, result){
    if(err){
      console.log("Could not connect to db", err)
      res.sendStatus(500);
    } else {
      console.log("Connected to db", result)
      res.send(result);
    }}
    );
};
//calc average of tests
let homeworkAverage = (req, res) => {
  console.log('homeworkAverage');
  db.query("select now()", function(err, result){
    if(err){
      console.log("Could not connect to db", err)
      res.sendStatus(500);
    } else {
      console.log("Connected to db", result)
      res.send(result);
    }}
    );
};

//calculate GPA

//
//export the GPA calculation function, the testsAverage, hwAverage, quizAverage, and projectAverage functions

module.exports = {
  testsAverage,
  quizzesAverage,
  projectsAverage,
  homeworkAverage
}