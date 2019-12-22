let gulp = require('gulp');
let stylus = require('gulp-stylus');

gulp.task('css', function(){
	return gulp.src('src/www/css/**/*.css')
		.pipe(stylus())
		.pipe(gulp.dest('src/www/assets'));
});

gulp.task('watch:css', function(){
	gulp.watch('src/www/css/**/*.css', gulp.series(['css']));
});