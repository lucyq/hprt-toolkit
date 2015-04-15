// TODO: look up account locking

// APP.JS --- establishes backend
// LUCY QIN

/////////////////////////////////
//   D E P E N D E N C I E S   //
/////////////////////////////////
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session'); // creates in memory store
var mongo = require('mongodb');
var crypto = require('crypto');
var sendgrid = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);
// var fs = require('fs');
// var https = require('https');


///////////////////////////////////
//   C O N F I G U R A T I O N   //
///////////////////////////////////
var app = express();

// SECURE
// var server = https.createServer({
// 	cert: fs.readFileSync(__dirname + '/my.cert'),
// 	key: fs.readFileSync(__dirname + '/my.key')
// }, app);

// VIEWS SETUP
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// OTHER SETUP
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿
app.use(cookieParser());
app.use(expressSession({ secret: process.env.SESSION_SECRET || "butterflies",
						 resave: false, saveUninitialized: false})); // butterflies can be anything

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// DATABASE SETUP
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

var ObjectId = require('mongodb').ObjectID;

app.all('*', function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});



// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());

function verifyCredentials(username, password, done) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('users', function(err, collection) {
			if (username == null || password == null || username == "" || password == "") {
				done(err,null);
			} else {
				collection.find({'username':username}).toArray(function(err, items){
					if (items.length == 0) {
						done(null,null);
					} else {
						if (items[0].password == crypto.createHash('md5').update(password).digest("hex")) {
							done(null, {id: username, name: username});
						} else {
							done(null,null);
						}
					}
				});
			}
		});
	});
	// // Pretend this is using a real database
	// if (username == password) {
	// 	done(null, {id: username, name: username}); // user object with other info		
	// } else {
	// 	done(null,null); // no error but didn't authenticate correctly, validation failed
	// }
}

passport.use(new passportLocal.Strategy(verifyCredentials));
passport.use(new passportHttp.BasicStrategy(verifyCredentials));


// passport.use(new passportHttp.BasicStrategy(function(username, password, done){
// 	// Pretend this is using a real database
// 	if (username == password) {
// 		done(null, {id: username, name: username}); // user object with other info		
// 	} else {z
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



///////////////////////////
//   R E S O U R C E S   //
///////////////////////////
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


/////////////////////
//   R O U T E S   //
/////////////////////

// ACCOUNT MANAGEMENT
app.post('/login', passport.authenticate('local'), function(req,res) {
	res.redirect('home');
});

app.get('/create_user', function(req, res) {
	res.render('create_user', {
		isAuthenticated: req.isAuthenticated(), 
		user: req.user
	});
});

app.post('/create_user', function(req, res, next){
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('HPRT_accounts', function(err, col){
			var username = req.body.username;
			var email = req.body.email;
			var role = req.body.role_type;
			var created_at = new Date();
			var patients = [];
			var ver_code = Math.floor((Math.random() * 100000) + 1);

			if (username == null || email == null || role == null ||
				username == " " || email == " " || role == " ") {
				res.send('Missing Fields!');
			} else {
				col.find({'username': username}).toArray(function(err, items) {
					if (items.length != 0) {
						res.send("Username has been taken!");
					} else {
						// sendgrid.send({
						// 	to: email,
						// 	from: "hprt-toolkit@gmail.com",
						// 	subject: "Welcome to HPRT Toolkit",
						// 	text: "Hello! Here is your login information. Use the information below to finish creating your account! Username: " + username + "Verification code: " + ver_code + "hprt-toolkit.heroku.com/create_account";
						// }, function(err, json) {
						// 	if (err) {return console.error(err); }
						// 	console.log(json);
						// });
						col.insert({'username':username,
							'email':email,
							'password': " ",
     						'ver_code':crypto.createHash('md5').update(ver_code).digest("hex"),
							'first_name': " ",
							'last_name': " ",
     						'phone_num': " ",
     						'role':role,
     						'patients':patients,
     						'created_at':created_at
    					});
						res.redirect('/create_user');
					}
				});
			}
		});
	});
});

app.post('/create_account', function(req, res) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('HPRT_accounts', function(err, col) {
			var username = req.body.username;
			var email = req.body.email;
			var first_name = req.body.first_name;
			var last_name = req.body.last_name;
			var password = req.body.password;
			var ver_password = req.body.ver_password;
			var phone_num = req.body.phone_num;
			var ver_code = req.body.ver_code;

			var patients = new Array();

			if (username == null || email == null || first_name == null || last_name == null ||
				password == null || ver_password == null || phone_num == null || 
				username == " " || email == " " || first_name == " " || last_name == " " ||
				password == " " || ver_password == " " || phone_num == " ") {
				res.send("Missing fields!"); 
			} else {
				col.find({'username':username}).toArray(function(err, items) {
					if (items.length == 0) {
						res.send("user doesn't exist");
					} else {
						if (items[0].ver_code == ver_code) {
							col.update({'username':username}, {$set: {password:password, email:email, first_name:first_name, last_name:last_name, phone_num:phone_num, patients: patients}});
						}
 					}
				});
			}
		});
	});
});
	

// app.get('/login', function(req, res) {
// 	res.render('login', {
// 		isAuthenticated: req.isAuthenticated(), 
// 		user: req.user		
// 	});
// });

app.get('/create_account', function(req, res) {
	res.render('create_account', {
		isAuthenticated: req.isAuthenticated(), 
		user: req.user		
	});
});



app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});




// STATIC PAGES
app.get('/', function (req, res) {
	res.render('index', {
		isAuthenticated: false, 
		user: req.user
	});
});


app.get('/home', function(req, res){
	res.render('home', {
		isAuthenticated: req.isAuthenticated(), 
		user: req.user
	});
});

app.get('/quick_guide', function(req, res){
	res.render('quick_guide', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user		
	});
});

app.get('/home', function(req, res){
	res.render('home', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/manual', function(req, res) {
	res.render('manual', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

// Patient Information Pages
app.get('/add_patient_info', function(req, res) {
	res.render('add_patient_info', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/view_patient_info', function(req, res) {
	res.render('view_patient_info', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/questionnaires', function(req,res){
	res.render('questionnaires', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/ht_q', function(req,res){
	res.render('ht_q', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/hs_q', function(req,res){
	res.render('hs_q', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/guide', function(req,res){
	res.render('guide', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});



// ADDING DATA
app.post('/submit_guide', function(req, res) {
	console.log("HERE?");
	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connection to database!");
		}
		db.collection('HPRT_patients', function(err,col) {
			if (err) {
				res.send("Database error!");
			}


		});
	});
});


app.post('/new_patient', function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connecting to database!");
		}
		db.collection('HPRT_patients', function(err, col) {
			if (err) {
				res.send("Database error!");
			}

			var first_name = req.body.first_name;
			var last_name = req.body.last_name;
			var location = req.body.location;
			var dob = req.body.date_of_birth;
			var curr_age = req.body.curr_age;
			var gender = req.body.gender;
			var created_at = new Date();
			// var htq_records[];
			// var hsq_records[];
			var empty_array = {};

			// TODO: CHECK FOR NULL
			if (first_name == null || last_name == null || location == null || dob == null ||
				curr_age == null || gender == null || 
				first_name == " " || last_name == " " || location == " " || dob == " " ||
				curr_age == " " || gender == " ") {
				res.send("Missing fields!");
			} else {
				// TODO: check that patient doesn't already exist
				// col.find({'student':student}).toArray(function(err, items){
				// 	if (items.length != 0) {
				// 		res.send("You've already submitted a hypothesis!");
				col.insert({'first_name':first_name, 'last_name':last_name, 'location':location, 
							'dob':dob, 'gender':gender, 'created_at':created_at,  'htq_records': empty_array, 'hsq_records': empty_array}, function(err, items) {
					res.redirect('/guide')
					// res.redirect('/questionnaires')
				});		
			}

		});
	});

});


app.post('/hs_q', function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connecting to database!");
		}
		db.collection('HPRT_patients', function(err, col) {
			if (err) {
				res.send("Database error!");
			}

			var first_name = req.body.first_name;
			var last_name = req.body.last_name;
	
			var empty_array = {};

			// TODO: CHECK FOR NULL
			if (first_name == null || last_name == null || location == null || dob == null ||
				curr_age == null || gender == null || 
				first_name == " " || last_name == " " || location == " " || dob == " " ||
				curr_age == " " || gender == " ") {
				res.send("Missing fields!");
			} else {
				// TODO: check that patient doesn't already exist
				// col.find({'student':student}).toArray(function(err, items){
				// 	if (items.length != 0) {
				// 		res.send("You've already submitted a hypothesis!");
				col.insert({'first_name':first_name, 'last_name':last_name, 'location':location, 
							'dob':dob, 'gender':gender, 'created_at':created_at, 'htq_records': empty_array, 'hsq_records': empty_array}, function(err, items) {
					res.redirect('/questionnaires')
				});		
			}

		});
	});

});



// DATA RETRIEVAL
app.get("/find_patient", function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('HPRT_patients', function(err, col) {
			var first_name = req.query.first_name;
			var last_name = req.query.last_name;
			var dob = req.query.date_of_birth;

			if (first_name == null || last_name == null || dob == null) {
				res.send("Missing fields!");
			} else {
				col.find({'first_name':first_name, 'last_name':last_name, 'dob':dob}).toArray(function(err, items) {
					if (items.length == 0) {
						res.send("Patient doesn't exist!");
					} else {
						res.send(JSON.stringify(items[0]));
					}
				});
			}
		});
	});
});

app.get("/get_my_patients", function (req, res) {
	mongo.Db.connect(mongoUri, function (err, db) {
		var user = req.query.user;
		// db.collection('HPRT_accounts', function (err, col) {
		// 	col.find({'username': user}).toArray(function(err, items) {



		// 	});
		// });
		db.collection('HPRT_patients', function(err, col) {
			col.find().toArray(function(err, items){
				res.send(JSON.stringify(items));
			});
		});
	});
});




/////////////////////
//   S E R V E R   //
/////////////////////
var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening in port " + port);
});
// SECURE
// server.listen(port, function () {
// 	console.log('listening in on https://localhost:' + port);
// });
