// import { connection } from '../../helpers/constants'
const mysql = require('mysql');

export const connection = mysql.createConnection({
    host     : 'squid-productions.com',
    user     : 'u376134960_tomer',
    password : 'tGG0706a',
    // database : 'u376134960_arduino'
  });

export default (req, res) => {
  switch (req.method) {
    case "GET": {
      return;
    }
    case "POST": {
      const { data }= req.body;
      console.log('got a POST request')
      connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
       
        console.log('connected as id ' + connection.threadId);
        connection.end();
      });

      res.statusCode = 200;
      res.send("Success");
    }
  }
}