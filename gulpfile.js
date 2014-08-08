var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    artoo = require('gulp-artoo'),
    webserver = require('gulp-webserver');

// Files
var files = [
  './src/sabretache.js',
  './src/sabretache.readability.js',
  './src/plugins/*.js'
];

// Building the files
gulp.task('build', function() {
  return gulp.src(files)
    .pipe(concat('sabretache.concat.js'))
    .pipe(gulp.dest('./build'))
    .pipe(uglify())
    .pipe(rename('sabretache.min.js'))
    .pipe(gulp.dest('./build'));
});

// Building test bookmarklets
gulp.task('bookmarklets', function() {
  artoo.blank('sabretache.footprint.bookmark.js')
    .pipe(artoo({
      version: 'edge',
      settings: {
        scriptUrl: 'https://localhost:8000/test/bookmarklets/footprint_test.js',
        dependencies: [
          {
            name: 'sabretache',
            globals: 'sabretache',
            url: 'https://localhost:8000/build/sabretache.concat.js'
          }
        ]
      }
    }))
    .pipe(gulp.dest('./build/bookmarklets'));

  artoo.blank('sabretache.readability.bookmark.js')
    .pipe(artoo({
      version: 'edge',
      settings: {
        scriptUrl: 'https://localhost:8000/test/bookmarklets/readability_test.js',
        dependencies: [
          {
            name: 'sabretache',
            globals: 'sabretache',
            url: 'https://localhost:8000/build/sabretache.concat.js'
          }
        ]
      }
    }))
    .pipe(gulp.dest('./build/bookmarklets'));
});

// Watching
gulp.task('watch', function() {
  gulp.watch(files, ['build']);
});

// Server
gulp.task('serve', function() {
  return gulp.src('./')
    .pipe(webserver({
      directoryListing: true,
      https: true
    }));
});

// Macro-tasks
gulp.task('default', ['build', 'bookmarklets']);
gulp.task('work', ['build', 'serve', 'watch']);
