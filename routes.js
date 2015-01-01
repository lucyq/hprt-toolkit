var express = require('express');

var router = express.Router();



// INDEX 
router.get('/', function (req, res) {
	res.render('index', {
		isAuthenticated: false, 
		user: req.user
	});
});

// MANAGING USER ACCOUNTS
router.get('/login', function(req, res) {
	res.render('login');
});



router.post('/login', function(req,res) {

});



// RENDER STATIC ACCOUNTS
router.get('/quick_guide', function(req, res){
	res.render('quick_guide');
});

router.get('/home', function(req, res){
	res.render('home');
});

router.get('/manual', function(req, res) {
	res.render('manual');
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

