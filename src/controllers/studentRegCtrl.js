//import the db connection from ../model/db
const db = require('../model/db');
// import argon package
const argon = require('argon2');
// import json web token package
const jwt = require('jsonwebtoken');

/**This function will register a student as a user in the database
 * It should take in an email,
 * register a unique email address,
 * take in a password from the user
 * take in the minimum necessary information to create a new user for the app
 * store the hash of the password in the database, in their row
 */
const registerStudent = async (req, res, next) => {
  console.log('register student');

  let sql = "INSERT INTO users (user_name, user_role, email, pw_hash) VALUES (?, ?, ?, ?);";
  let name = req.body.name;
  let email = req.body.email;
  let role = 'student';
  let password = req.body.password;
  let pwHash = await argon.hash(password);
  let params = [name, role, email, pwHash];

  db.query(sql, params, function(err, result){
    if(err){
      console.log("could not add user", err);
      res.sendStatus(500);
      return;
    }else{
      //send query to get user Id from database by email
      //store user Id in a variable
      //use userId to create a student Id in the students table
      let sql2 = "SELECT id FROM users WHERE email = ?;";
      let params2 = [email];
      db.query(sql2, params2, function(err2, result2){
        if(err2){
          console.log("something went wrong", err2);
          res.sendStatus(500);
          return;
        };
        if(result2.length > 1){ //if find too many users
          res.sendStatus(500);
          return;
        };
        //if find too few users
        if(result2.length == 0){
          res.sendStatus(400);
          return;
        };
        //if here then user found store user id in variable and proceed to next db query
        let userId = result2[0].id;
        let sql3 = "INSERT INTO students (user_id) VALUES(?);";
        let params3 = [userId];
        db.query(sql3, params3, function(err3, result3){
          if(err3){
            console.log("something went wrong", err3);
            return;
          }else{
            res.sendStatus(204);
          }
        })
        
      })
      
    }
  });
};

/**This function will login a student user
 * It should take in an email,
 * and a password,
 * verify the password hash input matches that stored in the database for that unique email,
 * if it is incorrect, return a status code of 400 (bad)
 * if it is good, return a json web token for use in the app that includes:
 *    >userID
 *    >studentID >>>>can i write the access to the student ID into this functions code?
 */
const studentLogin = async (req, res) => {
  console.log('student login');
  //code here
  //get email from request body and password...
  let email = req.body.email;
  let password = req.body.password;

  //assign the sql statement to be used in the db query
  let sql = "SELECT id, pw_hash FROM users WHERE email = ?;";
  let params = [email]; //assign email as the param for the dbquery
  db.query(sql, params, async (err, result)=>{
    if(err){
      res.sendStatus(500);
      return;
    }
    
    if(result.length > 1){
      res.sendStatus(500);
      return;
    }

    if(result.length == 0){
      res.sendStatus(400)
      return;
    }

    //hold onto hash result from the db query
    let hash = result[0].pw_hash;
    let userId = result[0].id;

    //code for second db.query to get studentId
    let sql2 = "SELECT id FROM students WHERE user_id = ?;";
    let params2 = [userId];
    let studentId;
    //create user's token for them to receive if the password is verified
    let token = {
      "userId": userId,
      "email": email,
    };

    db.query(sql2, params2, async function(err2, result2){
        if(err2){
          console.log("could not get student id", err2);
          return;
        }else{
          studentId = result2[0].id;
          console.log("found student Id is", studentId);
          token = {
            "userId": userId,
            "email": email,
            "studentId": studentId,
          }
          //store boolean in variable for password verification
          let goodPassword = await argon.verify(hash, password);

          //console log test statements
          console.log(
            "userId is", userId,
            "studentId is", studentId
          )
    
          if(goodPassword){
            let signedToken = jwt.sign(token, process.env.JWT_SECRET);
            res.json(signedToken);
          } else {
            res.sendStatus(400);
          };
        };
      });
    
  });
};

const createStudentId = async (req, res) => {
  console.log("create student Id");

  //only call this callback function after the registration callback function
  let sql = "INSERT INTO students(user_id) VALUES(?);";
  let userId = req.token.userId;
  let params = [userId];

  console.log(req.token);

  //check to see if that user id has a student id already
  db.query(sql, params, (err, results) => {
    if(err){
      //do this
      console.log("server error, student id could not be created", err);
      res.sendStatus(500);
      return;
    } else {
      res.sendStatus(204);
      };
  });
};

const getStudentId = (req, res, next) => {
  console.log("getting student Id")
  let userId = req.token.userId;
  let studentId;
  let sql = "SELECT id FROM students WHERE user_id = ?;";
  let params = [userId];
  //query the students table for the student id
  db.query(sql, params, async (err, results)=>{
    if(err){
      console.log("server error", err);
      res.sendStatus(500);
      return;
    }
    if(results.length > 1){
      res.sendStatus(500);
      return;
    }
    if(results.length == 0){
      console.log('no student id found')
      return;
    } else {
    studentId = results[0].id;
    req.token.studentId = studentId;
    next();
    };
  });
}

//exports the student registration, and student login functions
module.exports = {
  registerStudent,
  studentLogin,
  createStudentId,
  getStudentId,
}