/**student controller functions for the grade book app */
const db = require('../model/db');

//function gets all the test grades for a student, and returns the array of test grades
const allTests = (req, res)=>{
  console.log("getting student tests");
  let studentId = req.token.studentId;
  console.log("token", req.token);
  console.log("studentId", studentId);
  let assignment_type = 'test';
  //sql for the db query for all the test grades for a student
  let sql = "SELECT assignments.id, assignments.assignment_name, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ? AND assignments.assignment_type =?;";
  let params = [studentId, assignment_type];
  db.query(sql, params, (err, results)=>{
    if(err){
      res.sendStatus(500);
    }else {
      console.log("grade results", results);
      res.send(results);
    }
  })
};

//function gets all the quiz grades for a student, and returns the array of quiz grades
const allQuizzes = (req, res)=>{
  console.log("getting student quizzes");
  let studentId = req.token.studentId;
  console.log("token", req.token);
  console.log("studentId", studentId);
  let assignment_type = 'quiz';
  //sql for the db query for all the test grades for a student
  let sql = "SELECT assignments.id, assignments.assignment_name, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ? AND assignments.assignment_type = ?;";
  let params = [studentId, assignment_type];
  db.query(sql, params, (err, results)=>{
    if(err){
      res.sendStatus(500);
    }else {
      console.log("grade results", results);
      res.send(results);
    }
  })
};

//function gets all the homework grades for a student, and returns the array of hw grades

//function gets all the project grades for a student, and returns the array of the project grades

//function returns the average of the student's test grades

//function returns the average of the student's quiz grades

//function returns the average of the student's hw grades

//function returns the average of the student's project grades

//function returns the name description and details of one grade by student id
const getGrade = (req, res) => {
  console.log("getting student detailed grade");
  let studentId = req.token.studentId;
  let assignmentId = req.params.id;

  //sql for the db query for all the test grades for a student
  let sql = "SELECT assignments.id, assignments.assignment_name, assignments.assignment_description, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ? AND assignments.id = ?;";

  let params = [studentId, assignmentId];
  db.query(sql, params, (err, results)=>{
    if(err){
      res.sendStatus(500);
    }else {
      res.json(results);
    }
  })
};

//function returns all the grades that a student has from the grades table
const getGrades = (req, res)=>{
  console.log("getting student grades");
  let studentId = req.token.studentId;
  console.log("token", req.token);
  console.log("studentId", studentId);

  //sql for the db query for all the test grades for a student
  let sql = "SELECT assignments.id, assignments.assignment_name, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ?;";
  let params = [studentId];
  db.query(sql, params, (err, results)=>{
    if(err){
      res.sendStatus(500);
    }else {
      console.log("grade results", results);
      res.send(results);
    }
  })
};

//functions returns the student's gpa

//export the functions for student's:
//test, quiz, hw, project grades
//average for test, quiz, hw, project grades
//gpa
module.exports = {
  allTests,
  allQuizzes,
  getGrade, 
  getGrades
}