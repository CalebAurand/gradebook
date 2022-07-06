/**model sql statements for the gradebook app */


-- CREATE THE USERS TABLE
CREATE TABLE users 
(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
user_name VARCHAR(50) NOT NULL,
user_role VARCHAR(10) NOT NULL,
email VARCHAR(60) NOT NULL UNIQUE,
pw_hash VARCHAR(1000) NOT NULL
);

-- CREATE THE TEACHERS TABLE
CREATE TABLE teachers
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  certifications VARCHAR(200),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CREATE THE STUDENTS TABLE
CREATE TABLE students
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  birthday DATE NOT NULL,
  emergency_contact VARCHAR(100),
  accomodations VARCHAR(200),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CREATE THE CLASSES TABLE
CREATE TABLE classes
(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
class_subject VARCHAR(25) NOT NULL, 
class_name VARCHAR(25) NOT NULL,
teacher_id INT NOT NULL,
FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- CREATE THE STUDENTS_CLASSES TABLE
CREATE TABLE students_classes
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- CREATE THE CLASS_ATTENDANCE TABLE
CREATE TABLE class_attendance
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  record_date DATE NOT NULL,
  attendance VARCHAR(15) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- CREATE THE ASSIGNMENTS TABLE
CREATE TABLE assignments
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  assignment_type VARCHAR(15) NOT NULL,
  assignment_name VARCHAR(50) NOT NULL,
  assignment_description VARCHAR(500) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- CREATE THE GRADES TABLE
CREATE TABLE grades
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  grade INT NOT NULL,
  comments VARCHAR(250),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

/********import all the functions from the students controller.js file for use of retrieving student's:
 * //test, quiz, hw, project grades 
 * average for test, quiz, hw, project grades 
 * gpa
*/

-- get all the grades for a student
SELECT grade FROM grades WHERE student_id = ?;

-- get the test grades for a student
SELECT grade FROM grades WHERE student_id = ? AND assignment_id = ?;

-- get the quiz grades for a student
SELECT grade FROM grades WHERE student_id = ? AND assignment_id = ?;

-- get the homework grades for a student
SELECT grade FROM grades WHERE student_id = ? AND assignment_id = ?;

-- get the project grades for a student
SELECT grade FROM grades WHERE student_id = ? AND assignment_id = ?;



/*****Teacher Routes // teacher information*****/
  -- GET '/teachers' - returns a list of the teachers names for their school
  -- ? variable parameter is a range or list of all of the teachers ids
SELECT user_name FROM users WHERE user_role = 'teacher';

  -- GET '/teacher/:id' - (protected route) returns a teachers name, and email address
SELECT users.user_name, users.email, teachers.certifications FROM users INNER JOIN teachers ON users.id = teachers.user_id WHERE teachers.id = ?;

  -- PUT '/teacher/:id' - (protected route) allows a teacher to update their name
UPDATE users SET user_name = ? WHERE id = ?;

-- -- PUT '/teacher/:id' - (protected route) after verifying jwt again, allows a user to update their password
UPDATE users SET pw_hash = ? WHERE id = ?;

  -- DELETE '/teacher/:id' - (protected route) allows a teacher to delete **their own** account **if authorized**
DELETE FROM teachers WHERE id = ?;

  -- **POST** teachers are not allowed to make other teachers accounts
  -- *DELETE* teachers **are not** authorized to delete *other* teacher accounts


/******Teacher Routes // Class Creation/Information*****/

 /* POST '/class' - (protected route) creates a new class
    takes in: 
        Subject VARCHAR(50) NOT NULL
        Class_Name VARCHAR(60) NOT NULL
        Teacher_ID INT FOREIGN KEY

    then it:
        creates a row in the classes table with the class' id, subject, Class_Name, and Teacher_ID
  */
INSERT INTO classes(class_subject, class_name, teacher_id) VALUES (?, ?, ?);

  -- GET '/classes' - returns all the classes that a teacher is assigned to
SELECT class_subject, class_name FROM classes WHERE teacher_id = ?;

  -- GET '/class/:id' - returns the subject, class_name, and teacher_id for a class
SELECT class_subject, class_name, teacher_id, FROM classes WHERE id = ?;

  -- PUT '/class/:id' - (protected route) allows a teacher to update their class information
    -- [subject, class_name]
UPDATE classes SET class_subject = ?, class_name = ?, teacher_id = ? WHERE ID = ?; 

  -- DELETE '/class_name/:id' - (protected route) allows a teacher to remove a class from the classes table
    -- **constraints: there are no foreign keys relying on this class_ID yet**
DELETE FROM classes WHERE id = ?;

/*****Teacher Routes // students_classes Table *****/
  -- POST '/class_name' - (protected route) allows a teacher to add a new student in their class
  -- takes in:
  --     class_ID
  --     student_ID,
  --   then * adds the student to the class
INSERT INTO students_classes(class_id, student_id) VALUES(?, ?);

  -- GET '/class_name' - (protected route) allows a teacher to view all students in their class
  --   takes in:
  --     class_ID from the path parameter id and uses that to return all the students assigned to the matching class_ID
  SELECT classes.class_name, user_name, students.id FROM users INNER JOIN students_classes AND classes ON students.id = students_class.student_id AND classes.id = students_classes.class_id WHERE class_id = ?;

  -- GET '/class_name/:id' - (protected route) allows a teacher to view one specific student's profile information that is assigned to their class
  --   takes in:
  --     student_ID from the path paremeter id
  SELECT * FROM students WHERE id = ?;

  -- PUT **student ids will not be updated for a class roster, simply deleted or added**

  -- DELETE '/class_name/:id' (protected route) allows a teacher to delete a student from the students_classes table
  --   takes in:
  --     student_id from the path parameter id
  DELETE FROM students_classes WHERE student_id = ? and class_id = ?;

/*****Teacher Routes // Assignment Creation/Information*****/
 /* POST '/assignment' - (protected route) allows a teacher to create a new assignment
    takes in:
      name - name of the assignment
      description - description of the assignment, constraints, instructions, etc
      class_ID - class that the assignment is being made for*/
INSERT INTO assignments(class_id, assignment_type, assignment_name, assignment_description) VALUES(?, ?, ?, ?);

  /*PUT '/assignment/:id' - (protected route) allows a teacher to update an existing assignment
    takes in:
      id - id of the assignment
      name - name of the assignment
      description - description of the assignment, constraints, instructions, etc
      class_ID - class that the assignment is being made for*/
UPDATE assignments SET class_id = ?, assignment_type = ?, assignment_name = ?, assignment_description = ?;

  -- GET '/assignments/' - (protected route) allows a teacher to view all the assignments for a class
SELECT id, class_id, assignment_type, assignment_name FROM assignments WHERE class_id = ?;

  -- GET '/assignments/:id' - (protected route) allows a teacher to view an assignment in detail from assignment_ID
SELECT * FROM assignments WHERE id = ?;

  -- DELETE '/assignments/:id' - (protected route) allows a teacher to delete an assignment matching the assignment_ID
DELETE FROM assignments WHERE id = ?;


/*****Teacher Routes // Grade Creation/Information*****/
  /*POST '/createGrade' - (protected route) allows a teacher to create a new grade for a student
    takes in:
      assignment_ID - ID of the assignment from the assignments table
      Student_ID - ID of the student from the students table
      grade - numerical grade of the student for the assignment
      comments - teachers comments for the student about the assignment*/
INSERT INTO grades(assignment_id, student_id, grade, comments) VALUES(?, ?, ?, ?);

  /*PUT '/updateGrade/:id' - (protected route) allows a teacher to update an existing grade for a student
    takes in:
      assignment_ID
      Student_ID
      grade
      comments
      */
UPDATE grades SET assignment_id = ?, student_id = ?, grade = ?, comments = ?;

  /*GET '/class_name/grades/' - (protected route)(verifies that the teachers JWT Teacher_ID matches the class's Teacher_ID) 
    then 
      gets all assignment ids for the matching class_ID
      returns the grades for all the students held in the grades table (matching the assignment IDs)*/
SELECT id, assignment_name, grades.student_id, grades.grade FROM assignments INNER JOIN grades ON id = grades.assignment_id WHERE class_id = ?;

  /*GET '/class_name/grades/:id' - (protected route) gets the grades of one student in the specified class*/
SELECT id, assignment_name, grades.student_id, grades.grade FROM assignments INNER JOIN grades ON id = grades.assignment_id WHERE grades.student_id = ?;

  /*DELETE '/class_name/grades/:id' - (protected route) deletes one grade record of one student in the class (class_name) by the grade item's id
  */
DELETE FROM grades WHERE id = ?;

  /*****Teacher Routes // Attendance Creation/Information*****/
/*  POST '/attendance' - (protected route) allows a teacher to create a new attendance row for a student on a certain date
    takes in:
      Class_ID
      Student_ID
      date (date in month-day-year format)
      attendance VARCHAR(10) [present, absent, excused, tardy]

    then:
      creates that new row with the appropriate information, if it does not already exist in the attendance table*/
INSERT INTO class_attendance(class_id, student_id, record_date, attendance) VALUES(?, ?, ?, ?);

/*  PUT '/attendance/:id' - (protected route) allows a teacher to update a student's attendance record
    takes in:
      class_id
      student_id
      date
      attendance [present, absent, tardy, or excused]*/
UPDATE class_attendance SET record_date = ?, attendance = ? WHERE class_id = ? AND student_id = ?;

  -- GET '/class_name/attendance' - (protected route) allows a teacher to see all of the attendance records for their specified class in the address bar
SELECT student_id, record_date, attendance FROM class_attendance WHERE class_id = ?;

  -- GET '/class_name/attendance/:id' - (protected route) allows a teacher to see all of the attendance records for one student in a particular class (class_name)
SELECT student_id, record_date, attendance FROM class_attendance WHERE class_id = ? AND student_id = ?;

  -- GET '/attendance/:id' - (protected route) allows a teacher to see all of the attendance records [in all classes] for one student
SELECT student_id, class_id, record_date, attendance FROM class_attendance WHERE student_id = ?;

/*  DELETE 'class_name/attendance/:id' (protected route) allows a teacher to delete one specific attendance record for a student
    takes in:
      student_id as the path parameter
      class_id
      date
    then: deletes that date's attendance record
*/
DELETE FROM class_attendance WHERE class_id = ? AND student_id = ? AND record_date = ?;

/*****Teacher Routes // Student Viewing or Deletion*****/
  -- DELETE '/student/:id' (protected route) allows a teacher to delete a student record from the students table, and from the users table **if authorized**
DELETE FROM students WHERE id = ?;
  -- POST **Teachers cannot create students, that is done through student registration with a unique email**
  -- PUT ****
  -- GET '/student/:id' - teacher accesses student's profile information to see their info: accomodations, emergency contact, etc.

SELECT users.user_name, students.id, students.birthday, students.emergency_contact, students.accomodations FROM users INNER JOIN students ON students.id WHERE students.id = ?;


/*****Student Routes*****/
-- //route for student registration
INSERT INTO users (user_name, email, pw_hash) VALUES (?, ?, ?);

-- //route for student login
SELECT pw_hash FROM users WHERE email = ?;

-- //GET '/studentGrades' - returns a list of the students assignments and the associated grades
SELECT assignments.id, assignments.assignment_name, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ?;

-- //GET '/studentGrade/:id' - gives the details and any comments or notes that the teacher wrote on the student's individual assignment-grade
SELECT assignments.id, assignments.assignment_name, assignments.assignment_description, grades.grade FROM assignments INNER JOIN grades ON assignments.id = grades.assignment_id WHERE grades.student_id = ? AND assignments.id = ?;
-- //PUT '/student/:id' - (protected route) allows a student to update their password

-- //POST*****students do not have access to create new students*****
-- //PUT*****students do not have access to update email, name, or class associations*****
-- //DELETE*****students do not have access to delete their profile, or other students'*****

-- //DELETE '/student/:id' (protected route) allows a teacher to delete a student record from the students table, and from the users table **if authorized**