module.exports = function(app){
    app.get('/admin', middlewares.ensureAuthenticated, middlewares.ensureAdmin, function(req, res){
        db.collection('data').find({}, modelAdmin.adminPageModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                res.render('admin', {
                    brand: results[0].brand,
    				adminTitle: results[0].adminTitle,
    				adminButtonHome: results[0].adminButtonHome,
    				adminButtonDashboard: results[0].adminButtonDashboard,
    				adminButtonLogout: results[0].adminButtonLogout
                });
            };
        });
    });
}
