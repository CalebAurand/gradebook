//import express
// import teacher registration controller
//define a new router for use for teachers registration router

/*****Teacher Routes // login and Authorization*****
//route for teacher registration

POST '/register' - registers a new Teacher for the gradebook
  registers a teacher in the users table with role teacher, and in the teachers table with a teacher_ID
  takes in: -- automatically generates an id number, and a Role of teacher in the database
      name VARCHAR(50) NOT NULL
      email VARCHAR(50) NOT NULL UNIQUE
      pw_hash VARCHAR(1000) NOT NULL
*/

//route for teacher login
/*
POST '/login' - logs a teacher in to the gradebook, verifies email and pw_hash, then confirms that email and pw_hash has role of teacher and then issues a JWT     
  takes in:
      email
      password
*/


//export teacher registration/login router