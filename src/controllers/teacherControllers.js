/**teacher controller functions for the grade book app */

/********import all the functions from the students controller.js file for use of retrieving student's:
 * //test, quiz, hw, project grades 
 * average for test, quiz, hw, project grades 
 * gpa
*/




/*****Teacher Routes // teacher information*****
  GET '/teachers' - returns a list of the teachers names for their school

  GET '/teacher/:id' - (protected route) returns a teachers name, and email address

  PUT '/teacher/:id' - (protected route) allows a teacher to update their name, and/or password

  DELETE '/teacher/:id' - (protected route) allows a teacher to delete **their own** account **if authorized**

  **POST** teachers are not allowed to make other teachers accounts
  *DELETE* teachers **are not** authorized to delete *other* teacher accounts
*/

/******Teacher Routes // Class Creation/Information*****

  POST '/class' - (protected route) creates a new class
    takes in: 
        Subject VARCHAR(50) NOT NULL
        Class_Name VARCHAR(60) NOT NULL
        Teacher_ID INT FOREIGN KEY

    then it:
        creates a row in the classes table with the class' id, subject, Class_Name, and Teacher_ID

  GET '/classes' - returns all the classes that a teacher is assigned to, grouped together by subject

  GET '/class/:id' - returns the subject, class_name, and teacher_id for a class

  PUT '/class/:id' - (protected route) allows a teacher to update their class information
    [subject, class_name]

  DELETE '/class_name/:id' - (protected route) allows a teacher to remove a class from the classes table
    **constraints: there are no foreign keys relying on this class_ID yet**
*/


/*****Teacher Routes // students_classes Table *****
  POST '/class_name' - (protected route) allows a teacher to add a new student in their class
  takes in:
      class_ID
      student_ID,
    then * adds the student to the class

  GET '/class_name' - (protected route) allows a teacher to view all students in their class
    takes in:
      class_ID from the path parameter id and uses that to return all the students assigned to the matching class_ID

  GET '/class_name/:id' - (protected route) allows a teacher to view one specific student's profile information that is assigned to their class
    takes in:
      student_ID from the path paremeter id

  PUT **student ids will not be updated for a class roster, simply deleted or added**

  DELETE '/class_name/:id' (protected route) allows a teacher to delete a student from the students_classes table
    takes in:
      student_id from the path parameter id
*/

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

