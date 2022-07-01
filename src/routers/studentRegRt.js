/*****Student Routes*****/

//import express
// import student registration controller
//define a new router for use for student registration router


//route for student registration
/*POST '/registerStudent' - registers a new student to the gradebook app 
  takes in: 
    name VARCHAR(50)
    email VARCHAR(60)
    password >>>turned into a password hash

  then creates a new user in the users table with role of student
    adds the new user to the students table, 
    and links the userid as a foreign key on the students table
*/

//route for student login
/*POST '/studentlogin'- allows a student to login to see their grades / assignments
  takes in:
    email
    password

  if successful:
    returns a JWT with the student id attached
*/


//export student registration/login router