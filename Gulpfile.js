var gulp = require('gulp'),
  jsx = require('gulp-react');

gulp.task('build', function() {
  gulp.src('*.jsx')
    .pipe(jsx())
    .pipe(gulp.dest(''))
});

gulp.task('default', ['build']);
