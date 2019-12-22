let gulp = require('gulp');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify-es').default;
let ngAnnotate = require('gulp-ng-annotate');

gulp.task('js', function() {
	return gulp.src(['src/www/ng/**/module.js', 'src/www/ng/**/*.js'])
		.pipe(sourcemaps.init())
			.pipe(concat('app.js'))
			.pipe(ngAnnotate())
//			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/www/assets'));
});

gulp.task('watch:js', function(){
	gulp.watch('src/www/ng/**/*.js', gulp.series('js'));
});