/* Require modules */
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();

/* Browser sync */
gulp.task('browserSync', function(){
	browserSync.init({
		port: 3000,
		proxy: {
        	target: "localhost:3000",
        	ws: true
    	}
  	})
})

/* Less */
gulp.task('less', function() {
	return gulp.src('./public/less/*.less')
    	.pipe(less())
    	.pipe(gulp.dest('./public/css'))
    	.pipe(browserSync.reload({
    		stream: true
    	}))
});

/* Watch */
gulp.task('watch', ['browserSync', 'less'], function (){
	gulp.watch('public/views/*.pug', browserSync.reload);
	gulp.watch('./public/less/*.less', ['less']);
	gulp.watch('public/js/*.js', browserSync.reload);
});
