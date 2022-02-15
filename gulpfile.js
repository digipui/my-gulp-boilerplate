//gulp methode
const { src, series, parallel, dest, watch } = require("gulp");

//sass variabelen
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
//extra imagemin toevoeging voor opdracht
const imagemin = require("gulp-imagemin");
const { pipe } = require("rxjs");
const browsersync = require("browser-sync").create();

//image taak
function images() {
    return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"));
}

//sass taak
function scssTask() {
    return src("src/scss/style.scss", { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest("dist", { sourcemaps: "." }))
}

//js taak
function jsTask() {
    return src("src/js/script.js", { sourcemaps: true })
        .pipe(terser())
        .pipe(dest("dist", { sourcemaps: "." }))
}

//browser-sync taak
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: ".",
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

//watch taak
function watchTask() {
    //add image to watch
    watch(["src/img/*"], series(images, syncReload));
    watch("*.html", browsersyncReload)
    watch(
        ["src/scss/**/*.scss", "src/js/**/*.js"], series(scssTask, jsTask, browsersyncReload)
    );
}

//optioneel: individueel testen
exports.images = images;

//execute met gulp
exports.default = series(images, scssTask, jsTask, browsersyncServe, watchTask); 