/**
 * Import mysql
 * 
 * Create the db connection variable to access the database information typically held for each user in their .env file
 * need to program access to the database':
 * >host url:
 * >username:
 * >password:
 * >database name:
 * >port:
 * 
 * Then> run the connection
 * then>> test the connection
 * 
 * then export the database connection using the variable connection
 */
const mysql = require('mysql');

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST
})

connection.connect();

connection.query("select now()", function(err, result){
  if(err){
    console.log("Could not connect to db", err)
  } else {
    console.log("Connected to db", result)
  }
});

module.exports = connection;