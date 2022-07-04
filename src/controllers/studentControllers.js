/**student controller functions for the grade book app */
const db = require('../model/db');
//function gets all the test grades for a student, and returns the array of test grades
const allTests = (req, res)=>{
  let studentId = req.token.studentId;
  //sql for the db query for all the test grades for a student
  let sql = "SELECT assignment_name, grades.grade FROM assignments INNER JOIN ON assignments.id = grades.assignment_id WHERE grades.student_id = ?;";
  let pararms = [studentId];
  db.query(sql, params, (err, results)=>{
    if(err){
      res.sendStatus(500);
    }else {
      console.log("grade results", results);
      res.send(results);
    }
  })
}

//function gets all the quiz grades for a student, and returns the array of quiz grades

//function gets all the homework grades for a student, and returns the array of hw grades

//function gets all the project grades for a student, and returns the array of the project grades

//function returns the average of the student's test grades

//function returns the average of the student's quiz grades

//function returns the average of the student's hw grades

//function returns the average of the student's project grades

//functions returns the student's gpa

//export the functions for student's:
//test, quiz, hw, project grades
//average for test, quiz, hw, project grades
//gpa
module.exports = {
  allTests,
}