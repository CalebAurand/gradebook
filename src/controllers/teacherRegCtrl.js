//import the db connection from ../model/db
const db = require('../model/db');
// import argon package
const argon = require('argon2');
// import json web token package
const jwt = require('jsonwebtoken');

/**This function will register a teacher as a user in the database
 * It should take in an email,
 * register a unique email address,
 * take in a password from the user
 * take in the minimum necessary information to create a new user for the app
 * store the hash of the password in the database, in their row
 */
 const registerTeacher = async (req, res) => {
  console.log('register teacher');

  let sql = "INSERT INTO users (user_name, user_role, email, pw_hash) VALUES (?, ?, ?, ?);";
  let name = req.body.name;
  let email = req.body.email;
  let role = 'teacher';
  let password = req.body.password;
  let pwHash = await argon.hash(password);
  let params = [name, role, email, pwHash];

  db.query(sql, params, function(err, result){
    if(err){
      console.log("could not add user", err);
      res.sendStatus(500);
    }else{
      res.sendStatus(204);
    }
  });
};

/**This function will login a teacher user
 * It should take in an email,
 * and a password,
 * verify the password hash input matches that stored in the database for that unique email,
 * if it is incorrect, return a status code of 400 (bad)
 * if it is good, return a json web token for use in the app that includes:
 *    >userID
 *    ???>teacherID??? >>>>can i write the access to the teacher ID into this functions code?
 */
 const teacherLogin = (req, res) => {
  console.log('teacher login');

  //get email from request body and password...
  let email = req.body.email;
  let password = req.body.password;

  //assign the sql statement to be used in the db query
  let sql = "SELECT id, pw_hash from users where email = ?;";
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

    let teacherId;
    let sql2 = "SELECT id FROM teachers WHERE user_id = ?;";
    let params2 = [userId];
    //query the teachers table for the teacher id
    db.query(sql2, params2, async (err, results)=>{
      if(err){
        return;
      }
      if(results.length > 1){
        return;
      }
      if(results.length == 0){
        console.log('no teacher id found on login')
        return;
      }
      teacherId = results[0].id;
    });

    //store boolean in variable for password verification
    let goodPassword = await argon.verify(hash, password);

    //create user's token for them to receive if the password is verified
    let token = {
      "userId": userId,
      "email": email,
      "teacherId": teacherId,
    };
    
    if(goodPassword){
      let signedToken = jwt.sign(token, process.env.JWT_SECRET);
      res.json(signedToken);
    } else {
      res.sendStatus(400);
    };
  });
};

const createTeacherId = async (req, res) => {
  console.log("create teacher Id");

  //only call this callback function after the registration callback function
  let sql = "SELECT id FROM teachers WHERE user_id = ?;";
  let userId = req.token.userId;

  //set teacher Id as undefined, but ready to hold the teacherId if found
  let teacherId;
  let teacherParams = [userId];

  //check to see if that user id has a teacher id already
  db.query(sql, teacherParams, (err, results) => {
    if(err){
      //do this
      console.log("server error, teacher id could not be created", err);
      res.sendStatus(500);
      return;
    } else {
      if(results.length > 1){
        res.sendStatus(500);
        return;
      }
    teacherId = results[0].id;
      if(teacherId){
        console.log("teacher id found", teacherId);
        res.send('teacher id found');
        return;
      };
      //if no teacherId found for the userId >>> then we want to create one
      //error code 400 for testing right now

      let createSql = "INSERT INTO teachers(user_id) VALUES(?);";
      let createParams = [userId];
      if(results.length == 0){
        console.log("creating teacherId", teacherId);
        db.query(createSql, createParams, (err, createResults)=>{
          if(err){
            console.log("server error");
            return;
          }else{
            res.sendStatus(204);
          }
        })
      }
    };
  });
};

//exports the teacher registration, and teacher login functions
module.exports = {
  registerTeacher,
  teacherLogin,
  createTeacherId,
}