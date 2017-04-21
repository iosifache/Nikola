module.exports = function(app){
    app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}), function(req, res){});
    app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), function(req, res){
        res.redirect('/dashboard');
    });
    app.get('/logout', function(req, res){
      	req.logout();
      	res.redirect('/');
    });
}
