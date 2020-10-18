const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'squid-productions.com',
    user     : 'u376134960_tomer',
    password : 'tGG0706a',
    database : 'u376134960_arduino'
  });

connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
 
  console.log('connected as id ' + connection.threadId);
  connection.end();
    });