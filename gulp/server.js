let gulp = require('gulp');
let nodemon = require('gulp-nodemon');

gulp.task('dev:server', function(){
	nodemon({
		script: 'src/server.js',
		exit: 'js',
		ignore: ['ng*', 'gulp*', 'assets*']
	});
});