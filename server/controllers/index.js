module.exports = function(app){
    app.get('/', function(req, res){
        db.collection('data').find({}, modelAdmin.indexPageModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                res.render('index', {
                    brand: results[0].brand,
                    title: results[0].indexTitle,
                    button: results[0].indexButton
                });
            };
        });
    });
};
