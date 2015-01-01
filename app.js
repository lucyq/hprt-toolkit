// npm init --> package.json

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');


var app = express();
// configure app
app.engine('ejs', engine);
 app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views')) // __dirname : folder that contains this file



// serve contents of this path
app.use(express.static(path.join(__dirname, 'bower_components'))); 
app.use(express.static(path.join(__dirname, 'public')));


// middleware to parse body
// app.use(bodyParser);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿


// /* ERROR HANDLING */
// app.use(function(err, req, res, next){
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: err.message,
// 		error:err
// 	});
// });

// all the routes added to todos are now added here
app.use(require('./routes'));


// define routes 

// root

/* WHEN USING STATIC PAGES
app.get('/', function (req, res) {
	res.render('views/html/index.html');
});
*/

var port = process.env.PORT || 5000;


app.listen(port, function () {
	console.log('listening in on port ' + port);
});
