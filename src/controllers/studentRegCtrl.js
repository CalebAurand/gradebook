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
const registerStudent = (req, res) => {
  console.log('register student');

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
const studentLogin = (req, res) => {
  console.log('student login');
};


//exports the student registration, and student login functions
module.exports = {
  registerStudent,
  studentLogin
}