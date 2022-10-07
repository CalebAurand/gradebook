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
  console.log("request body", req.body)
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

//GET '/view-classes' - returns the classes that a teacher is assigned to
const getClasses = (req, res) => {
  console.log("get classes");
  let teacherId;
  if(req.token.teacherId){
    teacherId = req.token.teacherId;
  } else if(req.params.id){
    teacherId = req.params.id;
  } else {
    return;
  }
  let sql = "SELECT id, class_name, class_subject FROM classes WHERE teacher_id = ?;";
  let params = [teacherId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query db", err);
      res.sendStatus(500);
    }else{
      res.json(results);
    };
  });
}

//   GET '/view-count-classes' - returns all the classes that a teacher is assigned to, grouped together by class id, with the student count
const getCountClasses = (req, res) => {
  console.log("get count classes");
  let teacherId;
  if(req.token.teacherId){
    teacherId = req.token.teacherId;
  } else if(req.params.id){
    teacherId = req.params.id;
  } else {
    return;
  }
  let sql = "SELECT classes.id, classes.class_name, classes.class_subject, classes.teacher_id, COUNT(students_classes.student_id) AS count FROM classes LEFT JOIN students_classes ON classes.id = students_classes.class_id WHERE classes.teacher_id = ? GROUP BY classes.id ORDER BY classes.class_name;";
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

/**GET '/view-students' - (protected route) allows a teacher to view all students - for purpose of accessing student id's to add students to their class */
const viewStudents = (req, res) => {
  console.log("view all students");
  let sql = "SELECT students.id, users.user_name, users.email FROM students INNER JOIN users ON students.user_id = users.id;";
  db.query(sql, (err, result)=>{
    if(err){
      console.log("error", err);
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  })
}

/*GET '/class_name' - (protected route) allows a teacher to view all students in their class
    takes in:
      class_ID from the path parameter id and uses that to return all the students assigned to the matching class_ID*/
const viewStudentClass = (req, res) => {
  console.log("view list of students by class id")
  let sql = "SELECT students_classes.class_id, students.id, users.user_name FROM users INNER JOIN students ON students.user_id = users.id INNER JOIN students_classes ON students.id = students_classes.student_id WHERE class_id = ?;";
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
  let sql = "SELECT students.id, users.user_name, students.birthday, students.emergency_contact, students.accomodations FROM students INNER JOIN users ON users.id = students.user_id WHERE students.id = ?;";
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
  let sql = "DELETE FROM students_classes WHERE student_id = ? AND class_id = ?;";
  let class_id = req.params.id;
  let student_id = req.body.student_id;
  console.log(`remove studentId: ${student_id} from class: ${class_id}`);
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
      class_ID - class that the assignment is being made for*/
const addAssignment = (req, res) => {
  let classId = req.params.id;
  console.log("adding assignment to class ID:", classId);
  let sql = "INSERT INTO assignments(class_id, assignment_type, assignment_name, assignment_description) VALUES(?, ?, ?, ?);";
  let name = req.body.name;
  let type = req.body.type;
  let description = req.body.description;

  let params = [classId, type, name, description];
  db.query(sql, params, (err, result)=>{
    if(err){
      console.log("something went wrong", err)
      res.sendStatus(500);
    }else{
      if(result.length > 1){
        res.sendStatus(500);
        return;
      }else if(result.length == 0){
        res.sendStatus(400);
        return;
      }else{
        res.sendStatus(204);
      }
    }
  })

}

  /*PUT '/assignment/:id' - (protected route) allows a teacher to update an existing assignment
    takes in:
      id - id of the assignment
      name - name of the assignment
      description - description of the assignment, constraints, instructions, etc
      class_ID - class that the assignment is being made for*/
  const updateAssignment = (req, res) => {
    let assignmentId = req.params.id;
    console.log("updating assignment with ID:", assignmentId);
    let sql = "UPDATE assignments SET assignment_type = ?, assignment_name = ?, assignment_description = ? WHERE id = ?;"
    let name = req.body.name;
    let type = req.body.type;
    let description = req.body.description;
    let params = [type, name, description, assignmentId];

    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("could not query db", err);
        res.sendStatus(500);
      } else {
        //if there is more than one assignment with the id
        if(results.length > 1){
          res.sendStatus(500);
          return;
        };
        //if there is no assignment found
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

  /*GET '/assignments/:id' - (protected route) allows a teacher to view all the assignments for a class*/
  const getAssignments = (req, res) => {
  console.log("get assignments by class id");
  let classId = req.params.id;
  let sql = "SELECT * FROM assignments WHERE class_id = ?;";
  let params = [classId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not query database", err);
      res.sendStatus(500);
    } else {
      if(results.length == 0){
        res.sendStatus(400);
        return;
      };
      res.json(results);
    };
  });
};

  /*GET '/assignment/:id' - (protected route) allows a teacher to view an assignment in detail from assignment_ID*/
  const getAssignmentDetail = (req, res) => {
    console.log("getting details for assignment");
    let id = req.params.id;
    let sql = "SELECT * from assignments WHERE id = ?;";
    let params = [id];
    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("could not query database", err);
        res.sendStatus(500);
      } else {
        if(results.length == 0){
          res.sendStatus(400);
          return;
        };
        if(results.length > 1){
          res.sendStatus(400);
          return;
        };
        res.json(results);
      };
    });
  }

 /* DELETE '/assignment/:id' - (protected route) allows a teacher to delete an assignment matching the assignment_ID
*/
const deleteAssignment = (req, res) => {
  console.log("delete assignment");
  let assignmentId = req.params.id;
  let sql = "DELETE FROM assignments WHERE id = ?";
  let params = [assignmentId];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not issue query to database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    };
  });
};


/*****Teacher Routes // Grade Creation/Information*****/
  /*POST '/createGrade' - (protected route) allows a teacher to create a new grade for a student
    takes in:
      assignment_ID - ID of the assignment from the assignments table
      Student_ID - ID of the student from the students table
      grade - numerical grade of the student for the assignment
      comments - teachers comments for the student about the assignment*/
  const addGrades = (req, res) => {
    console.log('adding grades')
    let studentId = req.body.studentId;
    let gradesArr = req.body.grades;
    let gradesLength = gradesArr.length;
    console.log("studentid", studentId, "gradesArr", gradesArr, "gradesLength", gradesLength)
    let valueMarks = '';//turn this into dynamic string with question marks;
    for(let i=1; i<=gradesLength; i++){
      if(i===1){
        if(gradesLength === 1){
          valueMarks='(?, ?, ?);';
        }else{
          valueMarks='(?, ?, ?), ';
        };
      }if(i>1){
        if(i<gradesLength){
          valueMarks += '(?, ?, ?), ';
        }else if(i === gradesLength){
          valueMarks += '(?, ?, ?);';
        };
      };
    };
    let sql = `INSERT INTO grades(assignment_id, student_id, grade) VALUES${valueMarks}`
    const params = [];
    gradesArr.forEach(gradeItem=>{
        params.push(gradeItem.assignmentId);
        params.push(studentId);
        params.push(gradeItem.grade);
    });
    console.log('grades', gradesArr)
    console.log('valueMarks', valueMarks);
    console.log("params before post", params);
    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("err", err);
        res.sendStatus(500);
      }else{
        res.sendStatus(204);
      }
    })
  }

  // PUT '/update-grade/:id' - (protected route) allows a teacher to update an existing grade for a student
  //   takes in:
  //     assignment_ID
  //     Student_ID
  //     grade
  //     comments
  const updateGrade = (req, res) => {
    let gradeId = req.params.id;
    console.log("updating grade with id: ", gradeId);
    let grade = req.body.grade;
    let comments = req.body.comments;
    let sql = "UPDATE grades SET grade = ?, comments = ? WHERE id = ?;";
    let params = [grade, comments, gradeId];

    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("err", err);
        res.sendStatus(500);
      }else{
        if(results.length === 0){
          res.sendStatus(400);
        }else{
          res.sendStatus(200);
        };
      }
    })
  }

  // GET '/class_name/grades/' - (protected route)(verifies that the teachers JWT Teacher_ID matches the class's Teacher_ID) 
  //   then 
  //     gets all assignment ids for the matching class_ID
  //     returns the grades for all the students held in the grades table (matching the assignment IDs)

  const getGrades = (req, res) => {
    console.log("view grades by class id");
    let classId = req.params.id;
    let sql = "SELECT students.id AS studentId, users.user_name, grades.id AS gradeId, assignments.assignment_name, grades.grade, grades.comments FROM students INNER JOIN users ON users.id = students.user_id INNER JOIN grades ON students.id = grades.student_id INNER JOIN assignments ON assignments.id = grades.assignment_id WHERE assignments.class_id = ? ORDER BY grades.student_id;";
    let params = [classId];
    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("could not query database", err);
        res.sendStatus(500);
      } else {
        if(results.length == 0){
          res.sendStatus(400);
          return;
        };
        res.json(results);
      };
    });
  }

  /** GET 'get-student-grades/:id' - (protected route)(verifies the teacher has access, then 
gets all the grades assigned to that student ID, with corresponding teacher ID
so that teachers can only adjust grades from their classes, not others*/
  const getStudentGrades = (req, res)=>{
    console.log("getting student grades");
    let teacherId = req.token.teacherId;
    let studentId = req.params.id;
  
    //sql for the db query for all the grades for a student, filtered by teacherId
    let sql = "SELECT students.id AS studentID, classes.class_name, assignments.id AS assignment_id, assignments.class_id, assignments.assignment_name, assignments.assignment_type, grades.id AS gradeId, grades.grade, grades.comments FROM students INNER JOIN students_classes on students.id = students_classes.student_id INNER JOIN classes on classes.id = students_classes.class_id INNER JOIN assignments on classes.id = assignments.class_id INNER JOIN grades on assignments.id = grades.assignment_id WHERE students.id = ? AND grades.student_id = ? AND classes.teacher_id = ? ORDER BY grades.assignment_id;";
    let params = [studentId, studentId, teacherId];
    db.query(sql, params, (err, results)=>{
      if(err){
        res.sendStatus(500);
      }else {
        res.send(results);
      }
    })
  };

  // GET 'grade_detail/:id' - (protected route) gets the details of one grade in the specified class by grade id
  const getGradeDetail = (req, res) => {
    console.log("view grade detail by id");
    let gradeId = req.params.id;
    let sql = "SELECT students.id AS studentId, users.user_name, grades.id AS gradeId, assignments.class_id, assignments.assignment_name, assignments.assignment_type, assignments.assignment_description, grades.grade, grades.comments FROM students INNER JOIN users ON users.id = students.user_id INNER JOIN grades ON students.id = grades.student_id INNER JOIN assignments ON assignments.id = grades.assignment_id WHERE grades.id = ?;";
    let params = [gradeId];
    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("could not query database", err);
        res.sendStatus(500);
      } else {
        if(results.length == 0){
          res.sendStatus(400);
          return;
        };
        res.json(results);
      };
    });
  }

  /*DELETE '/class_name/grades/:id' - (protected route) deletes one grade record of one student in the class (class_name) by student_ID 
  */
  const deleteGrade = (req, res) => {
    let gradeId = req.params.id;
    console.log("delete Grade by id: ", gradeId);
    let sql = "DELETE FROM grades WHERE id = ?";
    let params = [gradeId];
  
    db.query(sql, params, (err, results)=>{
      if(err){
        console.log("could not issue query to database", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      };
    });
  };

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
  getCountClasses,
  getClass,
  updateClass,
  deleteClass,
  addStudent,
  viewStudents,
  viewStudentClass,
  viewStudent,
  removeStudent,
  getAssignments,
  getAssignmentDetail,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  getGrades,
  getStudentGrades,
  getGradeDetail,
  addGrades,
  updateGrade,
  deleteGrade
}