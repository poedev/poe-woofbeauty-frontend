var gulp = require('gulp');
var jade = require('gulp-jade');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var sequence = require('gulp-sequence');

var publicPath = 'server/public';
var server = 'server/server.js';

var srcPaths = {
  less: ['src/assets/less/*.less'],
  css: ['src/assets/css/*.css'],
  coffee: [
    'src/assets/js/coffee/site.coffee',
    'src/assets/js/coffee/*.coffee',
    'src/assets/js/coffee/plugins/*.coffee'
  ],
  jsLibs: [
    'src/assets/js/libs/jquery-1.11.3.min.js',
    'src/assets/js/libs/bootstrap.js',
    'src/assets/js/libs/plugins/*.js'
  ],
  jadeViews: ['src/views/jade/*.jade'],
  jadeWatch: ['src/views/jade/*.jade', 'src/views/jade/**/*.jade'],
  image: [
    'src/assets/images/*.png',
    'src/assets/images/*.jpg',
    'src/assets/images/**/*.jpg',
    'src/assets/images/**/*.png',
    'src/assets/images/**/*.gif',
    'src/assets/images/*.gif'
  ],
  media: ['src/assets/media/**/*','src/assets/media/*'],
  font: ['src/assets/fonts/*','src/assets/fonts/**/*']
};

var buildPath = {
  css: 'server/public/css',
  js: 'server/public/js',
  root: 'server/public',
  image: 'server/public/images',
  media: 'server/public/media',
  font: 'server/public/fonts'
};

gulp.task('less-css', function(){
  return gulp.src(srcPaths.less)
          .pipe(plumber())
          .pipe(less())
          .pipe(concat('style.css'))
          .pipe(autoprefix({
            browsers: ['last 3 versions'],
            cascade: false
          }))
          .pipe(cssmin())
          .pipe(gulp.dest(buildPath.css));
});

gulp.task('raw-css', function(){
  return gulp.src(srcPaths.css)
          .pipe(plumber())
          .pipe(autoprefix({
            browsers: ['last 3 versions'],
            cascade: false
          }))
          .pipe(cssmin())
          .pipe(gulp.dest(buildPath.css));
});

gulp.task('coffee-js', function(){
  return gulp.src(srcPaths.coffee)
          .pipe(plumber())
          .pipe(coffee())
          .pipe(jshint())
          .pipe(concat('script.js'))
          // .pipe(uglify())
          // .pipe(rename('script.min.js'))
          .pipe(gulp.dest(buildPath.js));
});

gulp.task('image', function(){
  return gulp.src(srcPaths.image)
          .pipe(imagemin())
          .pipe(gulp.dest(buildPath.image));
});

gulp.task('media', function(){
  return gulp.src(srcPaths.media)
          .pipe(gulp.dest(buildPath.media));
});

gulp.task('fonts', function(){
  return gulp.src(srcPaths.font)
          .pipe(gulp.dest(buildPath.font))
});

gulp.task('static-assets', ['image', 'media', 'fonts']);

gulp.task('lib-js', function(){
  return gulp.src(srcPaths.jsLibs)
          .pipe(plumber())
          .pipe(concat('libs.js'))
          .pipe(uglify())
          .pipe(gulp.dest(buildPath.js));
});

gulp.task('jade-html', function(){
  return gulp.src(srcPaths.jadeViews)
          .pipe(jade())
          .pipe(gulp.dest(buildPath.root));
});

gulp.task('public-build', ['less-css', 'raw-css', 'coffee-js', 'lib-js', 'jade-html', 'static-assets']);

gulp.task('clean-public', function(){
  return gulp.src(publicPath)
          .pipe(clean())
});

gulp.task('watch', function(){
  gulp.watch(srcPaths.less, ['less-css']);
  gulp.watch(srcPaths.css, ['raw-css']);
  gulp.watch(srcPaths.coffee, ['coffee-js']);
  gulp.watch(srcPaths.jsLibs, ['lib-js']);
  gulp.watch(srcPaths.jadeWatch, ['jade-html']);
  gulp.watch(srcPaths.image, ['image']);
});

gulp.task('run-server', function(){
  nodemon({
    script: server
  });
});

gulp.task('default', ['clean-public', 'public-build']);

gulp.task('server', sequence('clean-public', 'public-build', 'run-server', 'watch'));
