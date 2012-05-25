/**
 * Module dependencies.
 */
var routes = require('./routes');

exports.createRoutes = function make(app) {

	//Top routes
	//Loads all page with all media objects
	app.get('/all', routes.all);
	//loads the create page
	app.get('/create', routes.create);
	//loads the edit page
	app.get('/edit', routes.edit);
	//loads the home page
	app.get('/home', routes.home);
	app.get('/admin', routes.admin);
	app.get('/upload', routes.upload)
	app.get('/media', routes.media)
	app.get('/compare/:id', routes.compare)
	// Redirects
	app.get('/', function(req, res) {
		res.redirect('/home');
	});
	app.get('/browse',routes.browse)
	app.get('/overview/:id',routes.overview)
	app.get('/cors/result*', routes.results)

	app.get('/login', function(req, res) {
		res.render('login', {
			user : req.user,
			message : req.flash('error'),
			title : "login",
			id : "login"
		});
	});

	// Add Error pages
	app.use(function(req, res, next) {
		res.render('404.jade', {
			status : 404,
			title : "404 - Error",
			url : req.url,
			id : "/404"
		});
	});
	app.use(function(err, req, res, next) {
		res.render('500.jade', {
			status : err.status || 500,
			error : err,
			id : "/500"
		});
	});

}
