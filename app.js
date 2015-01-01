// npm init --> package.json
// var fs = require('fs');
// var https = require('https');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session'); // creates in memory store

var app = express();

// SECURE
// var server = https.createServer({
// 	cert: fs.readFileSync(__dirname + '/my.cert'),
// 	key: fs.readFileSync(__dirname + '/my.key')
// }, app);


app.engine('ejs', engine);
app.set('view engine', 'ejs');




// CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿
app.use(cookieParser());
app.use(expressSession({ secret: process.env.SESSION_SECRET || "butterflies",
						 resave: false, saveUninitialized: false})); // butterflies can be anything
app.use(passport.initialize());
app.use(passport.session());

function verifyCredentials(username, password, done) {
	// Pretend this is using a real database
	if (username == password) {
		done(null, {id: username, name: username}); // user object with other info		
	} else {
		done(null,null); // no error but didn't authenticate correctly, validation failed
	}
}

passport.use(new passportLocal.Strategy(verifyCredentials));
passport.use(new passportHttp.BasicStrategy(verifyCredentials));
// passport.use(new passportLocal.Strategy(function(username, password, done) {
// 	// Pretend this is using a real database
// 	if (username == password) {
// 		done(null, {id: username, name: username}); // user object with other info		
// 	} else {
// 		done(null,null); // no error but didn't authenticate correctly, validation failed
// 	}
// }));

// passport.use(new passportHttp.BasicStrategy(function(username, password, done){
// 	// Pretend this is using a real database
// 	if (username == password) {
// 		done(null, {id: username, name: username}); // user object with other info		
// 	} else {
// 		done(null,null); // no error but didn't authenticate correctly, validation failed
// 	}
// })); // also another mode

passport.serializeUser(function(user, done){
	// would query database usually
	done(null, user.id); // first arg is error
}); // passport invokes functio nfor us

passport.deserializeUser(function(id, done) {
	// query databse here
	done(null, {id: id, name: id});
});


// RESOURCES
//app.set('views', path.join(__dirname, 'views')) // __dirname : folder that contains this file
// serve contents of this path
app.use(express.static(path.join(__dirname, 'bower_components'))); 
app.use(express.static(path.join(__dirname, 'public')));


function ensureAuthorized(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		res.sendStatus(403);
		//res.redirect('/login'); // not logged in, can't get api/data!
	}
}

app.use('/api', passport.authenticate('basic', { session: false})); // reauthenticate


// Passport Config
app.get('/api/data', ensureAuthorized, function(req, res) {
	res.json([
		{value: 'foo'},
		{value: 'bar'},
		{value: 'baz'}]);
});



// all the routes added to todos are now added here

app.use(require('./routes'));
app.use(require('./errors'));

app.post('/login', passport.authenticate('local'), function(req,res) {
	res.redirect('home');
});

app.get('/login', function(req, res) {
	res.render('login', {
		isAuthenticated: req.isAuthenticated(), 
		user: req.user		
	});
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});



app.get('/home', function(req, res){
	res.render('home', {
		isAuthenticated: req.isAuthenticated(), 
		user: req.user
	});
});



// define routes 

// root

/* WHEN USING STATIC PAGES
app.get('/', function (req, res) {
	res.render('views/html/index.html');
});
*/

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening in port " + port);
});
// SECURE
// server.listen(port, function () {
// 	console.log('listening in on https://localhost:' + port);
// });
