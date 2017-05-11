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

gulp.task("style", function() {
	 gulp.src("css/style.scss")
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
	.pipe(gulp.dest("css")) //создаем обычный css файл
	.pipe(server.reload({stream: true}))
	.pipe(csso()) //минифицируем
	.pipe(rename("style.min.css"))
	.pipe(gulp.dest("css"));
});

gulp.task("images", function() {
	return gulp.src("img/**/*.{png,jpg,gif}")
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true})
	]))
	.pipe(gulp.dest("img"));
});

gulp.task("compress1", function() {
	return gulp.src("img/**/*.jpg")
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
	.src("img/sources/icons/*.svg") //откуда
	.pipe(svgmin()) //минифицируем
	.pipe(svgstore({ 
		inlineSvg: true //вырезать лишнее
	}))
	.pipe(rename("sprite.svg")) //имя спрайта
	.pipe(gulp.dest("img/sprite")) //куда сохранить спрайт
})


gulp.task("serve", ["style"], function() {
	server.init({
		server: "." //тут говорим серверу смотреть в текущий каталог
	});
	gulp.watch("css/**/*.scss", ["style"]);
	gulp.watch("*.html").on("change", server.reload)
})