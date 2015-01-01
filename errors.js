var express = require('express');

var error_router = express.Router();




// // catch 404 and forward to error handler
// error_router.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error_router.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 500;
//     next(err);
// });

// error_router.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 503;
//     next(err);
// });



// // error handlers

// // development error handler
// // will print stacktrace
// if (error_router.get('env') === 'development') {
//     error_router.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// error_router.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });



module.exports = error_router;