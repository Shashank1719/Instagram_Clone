const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    database: "instagram_clone",
    user: "root",
    password: ""
})


connection.connect(function(error){
    if(error) throw error;
    else console.log("Database Connected !!!");
})

module.exports = connection;