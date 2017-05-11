var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var cheerio = require('gulp-cheerio');
var run = require("run-sequence");
var del = require("del");
var debug = require("gulp-debug");
var newer = require("gulp-newer");
var deploy = require("gulp-gh-pages");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task("style", function() {
	return gulp.src("css/style.scss")
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(postcss([
		autoprefixer({browsers: [
			"last 1 version",
			"last 2 Chrome versions",
			"last 2 Firefox versions",
			"last 2 Opera versions",
			"last 2 Edge versions"
		]}),
		mqpacker({sort: true})
	]))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("build/css")) //создаем обычный css файл
//	.pipe(server.stream({match: '**/*.css'}))
//	.pipe(debug({title: 'css'}))
	.pipe(csso()) //минифицируем
	.pipe(rename("style.min.css"))
	.pipe(gulp.dest("build/css"))
//	.pipe(server.reload({stream: true}))
//	.pipe(debug({title: 'server'}));
});

gulp.task("images", function() {
	return gulp.src("build/img/**/*.{png,jpg,gif}")
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true})
	]))
	.pipe(gulp.dest("build/img"));
});

gulp.task("compress1", function() {
	return gulp.src("build/img/**/*.jpg")
	.pipe(imagemin([
		imageminJpegRecompress({
			accurate: true,
			quality: 'low'
		})
	]))
	.pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
	return gulp
	.src("build/img/sources/icons/*.svg") //откуда
	.pipe(svgmin()) //минифицируем
	.pipe(svgstore({ 
		inlineSvg: true //вырезать лишнее
	}))
	.pipe(cheerio(function ($) {
      $('svg').attr('style',  'display:none');
	}))
	.pipe(rename("sprite.svg")) //имя спрайта
	.pipe(gulp.dest("build/img/sprite")) //куда сохранить спрайт
});

gulp.task("serve", ["style", "js"], function() {
	server.init({
		server: "build" //корневой каталог build, все пути относительно его
	});
	gulp.watch("css/**/*.scss", ["style"]);
	gulp.watch("*.html", ["copy"]);	
	gulp.watch("js/**/*.js", ["js"]);	
//	gulp.watch("build/**/*.html").on("change",	server.reload);
//	server.watch("build/**/*.css").on("change", server.reload({stream: true}));
	server.watch("build/**/*.*").on("change", server.reload);
});

///////////////////

gulp.task("work", function(fn) {
	run(
		"copy",
		"serve",
		fn
	);
});

gulp.task("build", function(fn) {
	run(
		"clean",
		"copy",
		"style",
		"images",
		"sprite",
		fn);
});

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.{woff, woff2}",
		"img/**",
//		"js/**",
		"*.html"
	], {
		base: "."
	})
//	.pipe(debug({title: 'src'}))
	.pipe(newer("build"))
//	.pipe(debug({title: 'newer'}))
	.pipe(gulp.dest("build"))
//	.pipe(debug({title: 'dest'}))
});

gulp.task("clean", function() {
	return del("build");
});

gulp.task("deploy", function() {
	return gulp.src("build/**/*")
	.pipe(deploy())
});


gulp.task('js', function() {
	return gulp.src('js/**/*.js')
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/js'));
});


