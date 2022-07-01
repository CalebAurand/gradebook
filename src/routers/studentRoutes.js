/*****Student Routes*****/


//GET '/studentGrades' - returns a list of the students assignments and the associated grades


//GET '/studentGrade/:id' - gives the details and any comments or notes that the teacher wrote on the student's individual assignment-grade

//PUT '/student/:id' - (protected route) allows a student to update their password

//POST*****students do not have access to create new students*****
//PUT*****students do not have access to update email, name, or class associations*****
//DELETE*****students do not have access to delete their profile, or other students'*****

//DELETE '/student/:id' (protected route) allows a teacher to delete a student record from the students table, and from the users table **if authorized**