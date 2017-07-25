exports.ensureAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) return next()
    else res.redirect('/');
}
exports.ensureAdmin = function(req, res, next){
    if (req.user._json.email==config.adminEmail) return next()
    else res.redirect('/dashboard');
}
exports.socketAuth = function(socket, next){
	if (user._json.email){
        next();
    }
    else console.log("Illegal Socket.io call")
};
