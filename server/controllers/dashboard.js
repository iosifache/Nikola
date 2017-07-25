module.exports = function(app){
    app.get('/dashboard', middlewares.ensureAuthenticated, function(req, res){
        db.collection('data').find({}, modelDashboard.dashboardPageModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                res.render('dashboard', {
    				brand: results[0].brand,
    			    title: results[0].dashboardTitle,
    				menu1: results[0].dashboardMenu1,
    				menu2: results[0].dashboardMenu2,
    				menu3: results[0].dashboardMenu3,
    				language: results[0].dashboardLanguage,
    				hour: results[0].dashboardHour,
    				outside: results[0].dashboardOutside,
    				platform: results[0].dashboardPlatform,
    				recommand: results[0].dashboardRecommand,
    				user: req.user
                });
    			user = req.user;
                db.collection('users').count({email:user._json.email}, function(err, resultsCount){
                    if (resultsCount==0) db.collection('users').insert({email: user._json.email, actual: 1});
                });
            };
        });
    });
};
