/**teacher controller functions for the grade book app */
const db = require('../model/db');

/********import all the functions from the students controller.js file for use of retrieving student's:
 * //test, quiz, hw, project grades 
 * average for test, quiz, hw, project grades 
 * gpa
*/


/*****Teacher Routes // teacher information*****/
  // GET '/teachers' - returns a list of the teachers names for their school
const viewTeachers = (req, res) => {
  console.log('viewTeachers names')
  //no params, function available to anyone viewing the site
  let sql = "SELECT user_name FROM users WHERE user_role = 'teacher';";

  //query the database for the teacher names
  db.query(sql, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    }else{
      res.json(results);
    };
  });
};

//   GET '/teacher/:id' - (protected route) returns a teachers name, and email address
const viewOneTeacher = (req, res) => {
  console.log("view teacher details")
  let teacherId = req.token.teacherId;

  let sql = "SELECT teachers.id, user_name, email, teachers.certifications FROM users INNER JOIN teachers ON users.id = teachers.user_id WHERE teachers.id = ?;"
  let params = [teacherId]
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      if(results.length > 1){
        res.json(500);
        return;
      };
      if(results.length == 0){
        res.json(400);
        return;
      };
      res.json(results);
    };
  });
};

//   PUT '/teacher/:id' - (protected route) allows a teacher to update their name, and/or password
const updateTeacher = (req, res) => {
  console.log("update teacher");
  //try to update teacher name here
  let userId = req.token.userId;
  let sql = "UPDATE users SET user_name = ? WHERE id = ?;";
  let teacherName = req.body.name;
  let params = [teacherName, userId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    };
  });
};

const updateCertifications = (req, res) => {
  console.log("update teacher certs")
  //try to update teacher certifications here
  let sql2 = "UPDATE teachers SET certifications = ? WHERE id = ?;";
  let teacherId = req.token.teacherId;
  let certifications = req.body.certifications;
  let params2 = [certifications, teacherId];

  db.query(sql2, params2, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    };
  });
};

//   DELETE '/teacher/:id' - (protected route) allows a teacher to delete **their own** account **if authorized**
const deleteTeacher = (req, res) => {
  console.log("delete teacher");

  //try to update teacher name here
  let teacherId = req.token.teacherId;
  let sql = "DELETE FROM teachers";
  let teacherName = req.body.name;
  let params = [teacherName, userId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    };
  });
};
//   **POST** teachers are not allowed to make other teachers accounts
//   *DELETE* teachers **are not** authorized to delete *other* teacher accounts
// */

/******Teacher Routes // Class Creation/Information*****/

  // POST '/class' - (protected route) creates a new class
  //   takes in: 
  //       class_ubject VARCHAR(50) NOT NULL
  //       class_Name VARCHAR(60) NOT NULL
  //       teacher_id INT FOREIGN KEY

  //   then it:
  //       creates a row in the classes table with the class' id, subject, Class_Name, and Teacher_ID
const createClass = (req, res) => {
  console.log("create class");
  let teacherId = req.token.teacherId;
  let class_subject = req.body.class_subject;
  let class_name = req.body.class_name;
  let params = [class_subject, class_name, teacherId];

  let sql = "INSERT INTO classes(class_subject, class_name, teacher_id) VALUES (?, ?, ?);"

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not create class", err);
      res.sendStatus(500);
    }else{
      res.sendStatus(204);
    };
  });
};

//   GET '/classes' - returns all the classes that a teacher is assigned to, grouped together by subject
const getClasses = (req, res) => {
  console.log("get classes");
  let teacherId = req.params.id;
  let sql = "SELECT class_subject, class_name FROM classes WHERE teacher_id = ?";
  let params = [teacherId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    }else{
      res.json(results);
    };
  });
};

//   GET '/class/:id' - returns the subject, class_name, and teacher_id for a class
const getClass = (req, res) => {
  console.log("get class with teacher_id");
  let classId = req.params.id;
  let sql = "SELECT id, class_subject, class_name, teacher_id FROM classes WHERE id = ?;";
  let params = [classId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    }else{
      //if there is more than one class
      if(results.length > 1){
        res.sendStatus(500);
        return;
      };
      //if there is no class found
      if(results.length == 0){
        res.sendStatus(404);
        return;
      };
      //if good results
      res.json(results);
    };
  });
};

//   PUT '/class/:id' - (protected route) allows a teacher to update their class information
//     [subject, class_name]
const updateClass = (req, res) => {
  console.log("update class");
  //get the teacher id
  let teacherId = req.token.teacherId;
  let classSubject = req.body.class_subject;
  let className = req.body.class_name;
  let classId = req.params.id;

  let sql = "UPDATE classes SET class_subject = ?, class_name = ?, teacher_id = ? WHERE id = ?;"
  let params = [classSubject, className, teacherId, classId];

  //run the db query with the specified params in the above order
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    } else {
      //if there is more than one class
      if(results.length > 1){
        res.sendStatus(500);
        return;
      };
      //if there is no class found
      if(results.length == 0){
        res.sendStatus(404);
        return;
      };
      //if good results
        //either send the results back, or send back 204 code
      res.sendStatus(204);
    };
  });
};

//   DELETE '/class_name/:id' - (protected route) allows a teacher to remove a class from the classes table
//     **constraints: there are no foreign keys relying on this class_ID yet**
// */
const deleteClass = (req, res) => {
  console.log("delete class")
  let teacherId = req.token.teacherId;
  let sql = "DELETE FROM classes WHERE id = ? and teacher_id = ?;";
  let classId = req.params.id;
  let params = [classId, teacherId];
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    } else {
      //if there is more than one class
      if(results.length > 1){
        res.sendStatus(500);
        return;
      };
      //if there is no class found
      if(results.length == 0){
        res.sendStatus(404);
        return;
      };
      //if good results
        //either send the results back, or send back 204 code
      res.sendStatus(204);
    };
  })
}

/*****Teacher Routes // students_classes Table *****/
  /*POST '/class_name' - (protected route) allows a teacher to add a new student in their class
  takes in:
      class_ID
      student_ID,
    then * adds the student to the class*/

const addStudent = (req, res) => {
  let classId = req.params.id;
  let studentId = req.body.student_id

  let sql = "INSERT INTO students_classes(class_id, student_id) VALUES(?, ?);";
  let params = [classId, studentId];
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    } else {
      //if there is more than one class
      if(results.length > 1){
        res.sendStatus(500);
        return;
      };
      //if there is no class found
      if(results.length == 0){
        res.sendStatus(404);
        return;
      };
      //if good results
        //either send the results back, or send back 204 code
      res.sendStatus(204);
    };

  })
};

/*GET '/class_name' - (protected route) allows a teacher to view all students in their class
    takes in:
      class_ID from the path parameter id and uses that to return all the students assigned to the matching class_ID*/
const viewStudentClass = (req, res) => {
  console.log("view list of students by class id")
  let sql = "SELECT students_classes.class_id, user_name, students_classes.student_id FROM users INNER JOIN students ON students.user_id = users.id INNER JOIN students_classes WHERE class_id = ?;";
  let classId = req.params.id;
  let params = [classId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    } else {
      //if there is no class/students found
      if(results.length == 0){
        res.sendStatus(404);
        return;
      };
      //if good results
        //either send the results back, or send back 204 code
      res.json(results);
    };
  })
};
/*GET '/class_name/:id' - (protected route) allows a teacher to view one specific student's profile information that is assigned to their class
    takes in:
      student_ID from the path paremeter id*/
const viewStudent = (req, res) => {
  console.log("view student by id")
  let studentId = req.params.id;
  let sql = "SELECT users.user_name, students.id, students.birthday, students.emergency_contact, students.accomodations FROM students INNER JOIN users ON users.id = students.user_id WHERE students.id = ?;";
  let params = [studentId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      if(results.length > 1){
        res.sendStatus(500);
        return;
      };
      if(results.length == 0){
        res.sendStatus(400);
        return;
      };
      res.json(results);
    };
  });
};
// PUT **student ids will not be updated for a class roster, simply deleted or added**

/*DELETE '/class_name/:id' (protected route) allows a teacher to delete a student from the students_classes table
    takes in:
      student_id from the path parameter id
*/
const removeStudent = (req, res) => {
  console.log("remove from class")
  let sql = "DELETE FROM students_classes WHERE student_id = ? AND class_id = ?;";
  let class_id = req.body.class_id;
  let student_id = req.body.student_id;
  let params = [student_id, class_id];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not issue query to database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    };
  });
};

/*****Teacher Routes // Assignment Creation/Information*****
  POST '/assignment' - (protected route) allows a teacher to create a new assignment
    takes in:
      name - name of the assignment
      description - description of the assignment, constraints, instructions, etc
      class_ID - class that the assignment is being made for

  PUT '/assignment/:id' - (protected route) allows a teacher to update an existing assignment
    takes in:
      id - id of the assignment
      name - name of the assignment
      description - description of the assignment, constraints, instructions, etc
      class_ID - class that the assignment is being made for

  GET '/assignments/' - (protected route) allows a teacher to view all the assignments for a class

  GET '/assignments/:id' - (protected route) allows a teacher to view an assignment in detail from assignment_ID

  DELETE '/assignments/:id' - (protected route) allows a teacher to delete an assignment matching the assignment_ID
*/


/*****Teacher Routes // Grade Creation/Information*****
  POST '/createGrade' - (protected route) allows a teacher to create a new grade for a student
    takes in:
      assignment_ID - ID of the assignment from the assignments table
      Student_ID - ID of the student from the students table
      grade - numerical grade of the student for the assignment
      comments - teachers comments for the student about the assignment

  PUT '/updateGrade/:id' - (protected route) allows a teacher to update an existing grade for a student
    takes in:
      assignment_ID
      Student_ID
      grade
      comments

  GET '/class_name/grades/' - (protected route)(verifies that the teachers JWT Teacher_ID matches the class's Teacher_ID) 
    then 
      gets all assignment ids for the matching class_ID
      returns the grades for all the students held in the grades table (matching the assignment IDs)

  GET '/class_name/grades/:id' - (protected route) gets the grades of one student in the specified class

  DELETE '/class_name/grades/:id' - (protected route) deletes one grade record of one student in the class (class_name) by student_ID 
  */

  /*****Teacher Routes // Attendance Creation/Information*****
  POST '/attendance' - (protected route) allows a teacher to create a new attendance row for a student on a certain date
    takes in:
      Class_ID
      Student_ID
      date (date in month-day-year format)
      attendance VARCHAR(10) [present, absent, excused, tardy]

    then:
      creates that new row with the appropriate information, if it does not already exist in the attendance table

  PUT '/attendance/:id' - (protected route) allows a teacher to update a student's attendance record
    takes in:
      class_id
      student_id
      date
      attendance

  GET '/class_name/attendance' - (protected route) allows a teacher to see all of the attendance records for their specified class in the address bar

  GET '/class_name/attendance/:id' - (protected route) allows a teacher to see all of the attendance records for one student in a particular class (class_name)

  GET '/attendance/:id' - (protected route) allows a teacher to see all of the attendance records [in all classes] for one student

  DELETE 'class_name/attendance/:id' (protected route) allows a teacher to delete one specific attendance record for a student
    takes in:
      student_id as the path parameter
      class_id
      date
    then: deletes that date's attendance record
*/


/*****Teacher Routes // Student Viewing or Deletion*****
  DELETE '/student/:id' (protected route) allows a teacher to delete a student record from the students table, and from the users table **if authorized**

  POST **Teachers cannot create students, that is done through student registration with a unique email**
  PUT ****
  GET '/student/:id' - teacher accesses student's profile information to see their info: accomodations, emergency contact, etc.
*/





//export the functions for teachers controller
module.exports = {
  viewTeachers,
  updateTeacher,
  updateCertifications,
  viewOneTeacher,
  deleteTeacher,
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  addStudent,
  viewStudentClass,
  viewStudent,
  removeStudent,
  
}