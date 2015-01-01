var express = require('express');

var router = express.Router();


var user_bool;

// INDEX 
router.get('/', function (req, res) {
	res.render('index', {
		isAuthenticated: false, 
		user: req.user
	});
});

// MANAGING USER ACCOUNTS






// RENDER STATIC ACCOUNTS
router.get('/quick_guide', function(req, res){
	res.render('quick_guide', {
		isAuthenticated: false, 
		user: req.user		
	});
});

router.get('/home', function(req, res){
	res.render('home', {
		isAuthenticated: true, 
		user: req.user
	});
});

router.get('/manual', function(req, res) {
	res.render('manual', {
		isAuthenticated: true, 
		user: req.user
	});
});

// Patient Information Pages
router.get('/add_patient_info', function(req, res) {
	res.render('add_patient_info', {
		isAuthenticated: true, 
		user: req.user
	});
});

router.get('/view_patient_info', function(req, res) {
	res.render('view_patient_info', {
		isAuthenticated: true, 
		user: req.user
	});
});


router.get('/patients/new', function(req, res) {
	res.render('patients/new', {
		isAuthenticated: true, 
		user: req.user
	});
});




// router.post('/add', function (req, res) {
// 	var newItem = req.body.newItem; 
// 	todoItems.push({
// 		id: todoItems.length + 1,
// 		desc: newItem

// 	});
// 	res.redirect('/');
// });

// exports router
module.exports = router;

