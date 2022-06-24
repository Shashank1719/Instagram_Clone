var express = require('express');
const session = require('express-session');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});

// Get register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', session : req.session });
});

// login page post request
router.post('/login', function(request, response, next){

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;

    if(user_email_address && user_password)
    {
        query = `
        SELECT * FROM register 
        WHERE email = "${user_email_address}" AND password="${user_password}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].password == user_password)
                    {
                        request.session.uID = data[0].userId;
                        request.session.uname = data[0].username;
                        response.redirect("/");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address or password');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});

// register page post request

router.post('/register', function(request, response, next){

    var user_email_address = request.body.user_email_address;
    var username = request.body.username;
    var name = request.body.name;
    var user_password = request.body.user_password;

    if(user_email_address && user_password && username && name)
    {
        
        // select query to check username is already taken or not
        SelectQuery = `
        SELECT * FROM register 
        WHERE username = "${username}"
        `;

        database.query(SelectQuery, function(error, data){

            if(data.length > 0)
            {
                response.send('Username has been already taken, please select another one');
            }
            else
            {
                InsertQuery = `INSERT INTO register(username, password, name, email) VALUES ("${username}","${user_password}","${name}","${user_email_address}")`;
                database.query(InsertQuery, function(error, data){
                    if(error) {
                        response.status(500).send('Some internal error occured');
                    }
                    else {
                        response.send('Register Successfully...');
                        // response.redirect("/dashboard");     // change to feed page
                    }
                });

            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Details');
        response.end();
    }

});


// logout page request
router.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});

module.exports = router;