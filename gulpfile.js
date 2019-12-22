let fs = require('fs');
let gulp = require('gulp');

fs.readdirSync(__dirname + '/gulp').forEach(function(task){
	require('./gulp/' + task);
});

gulp.task('dev', gulp.series('css', 'js', gulp.parallel('watch:css', 'watch:js', 'dev:server')));