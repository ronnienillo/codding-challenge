// * Gulp Dependencies
const gulp = require("gulp");
const plumber = require("gulp-plumber"); // Error Tracking
const del = require("del"); // Deleting Files
const browserSync = require("browser-sync").create(); // ! TODO WHAT DOES THIS DO

// * Processing JavaScript
const uglify = require("gulp-uglify"); // For Minifying JavaScript

// * Processing Images
const imagemin = require("gulp-imagemin"); // For Minifying Images
const cache = require("gulp-cache"); // ! TODO WHAT
const jpegrecompress = require("imagemin-jpeg-recompress"); // ! TODO WHAT
const pngquant = require("imagemin-pngquant"); // ! TODO WHAT
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');

// * Processing SASS & CSS
const sass = require("gulp-dart-sass"); // For Compiling SASS
const sourcemaps = require("gulp-sourcemaps"); // For including SASS Sourcemaps when compiling
const autoprefixer = require("gulp-autoprefixer"); // Adding Browser-specific prefixes to CSS
const cssnano = require("gulp-cssnano"); // ! TODO WHAT
const rename = require("gulp-rename"); // ! TODO WHAT

// * Processing HTML
const htmlpartial = require("gulp-html-partial"); // For Compiling HTML "<partial></partial>" Partials
const rigger = require("gulp-rigger"); // For Compiling HTML "//=" Partials

// * Processing SVGs
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const svg2string = require("gulp-svg2string");
const path = require('path');

const concat = require("gulp-concat");
const replace = require("gulp-replace");


// * Auto-Prefixer Options
var autoprefixerList = [
  "Chrome >= 45",
  "Firefox ESR",
  "Edge >= 12",
  "Explorer >= 10",
  "iOS >= 9",
  "Safari >= 9",
  "Android >= 4.4",
  "Opera >= 30",
];

// * Paths Variables
// -* Paths to source files (src), to ready-made files (build), as well as to those whose changes need to be monitored (watch)
var paths = {
  build: {
    // html: "build/",
    // js: "build/js/",
    // css: "build/css/",
    // img: "build/img/",
    fonts: "build/fonts/",
    html: "build/",
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    svg: "build/svg",
  },
  src: {

    fonts: "src/fonts/**/*.*",
    html: "src/*.html",
    js: "src/js/index.js",
    sass: "src/sass/index.scss",
    partials: "src/partials/",
    img: "src/img/**/*.*",
    svg: "src/svg/**/*.*",
    svgSrc: "src/svg/src/**/*.*",
    svgDist: "src/svg/dist/",
    jsSvg: "src/js/svg.js",
  },
  watch: {
    fonts: "src/fonts/**/*.*",
    html: "src/*.html",
    partials: "src/partials",
    css: "src/sass/**/*.scss",
    img: "src/img/**/*.*",
    js: "src/js/**/*.js",
    svg: "src/svg",
  },
  clean: "./build",
};

// make svgs
gulp.task("svg-make", function () {
  del.sync(paths.src.svgDist);

  return gulp
    .src(paths.src.svgSrc)
    .pipe(
      svgmin(function getOptions(file) {
        var prefix = path.posix.basename(
          file.relative,
          path.extname(file.relative)
        );
        return {
          plugins: [
            //list of plugins https://github.com/svg/svgo/tree/master/plugins
            //add unique id
            {
              cleanupIDs: {
                prefix: prefix + "-",
                minify: true,
              },
            },
            {
              removeViewBox: false,
            },
            // remove width and height
            {
              removeDimensions: true,
            },
          ],
        };
      })
    )
    .pipe(gulp.dest(paths.src.svgDist))
    .pipe(svgstore())
    .pipe(svg2string())
    .pipe(rename(paths.src.jsSvg))
    .pipe(gulp.dest("./"));
});

// -* Build HTML
gulp.task("html:build", function (done) {
  gulp
    .src([paths.src.html, "!./src/partials/*"]) // Find all HTML files
    .pipe(plumber()) // Tracking Errors
    .pipe(
      htmlpartial({
        basePath: paths.src.partials,
      })
    ) // Import "<partial src="..."></partial>" partials
    .pipe(rigger()) // Import "//=" partials
    .pipe(gulp.dest(paths.build.html)) // Outputting compiled files to dest
    .pipe(browserSync.reload({
      stream: true
    })); // Server Reboot
  done();
});

// -* Build CSS
gulp.task("css:build", function (done) {
  gulp
    .src(paths.src.sass) // get common.scss
    .pipe(plumber()) // errors tracking
    .pipe(sourcemaps.init()) // initialize sourcemap
    .pipe(sass())
    // .pipe(replace("/img/", " ../img/"))
    .pipe(replace("/fonts/", " ../fonts/"))
    .pipe(
      autoprefixer({
        // add prefixes
        // browsers: autoprefixerList,
      })
    )
    .pipe(gulp.dest(paths.build.css))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cssnano()) // minimizing CSS
    .pipe(sourcemaps.write("./")) // write sourcemap
    .pipe(gulp.dest(paths.build.css)) // upload to build
    .pipe(browserSync.reload({
      stream: true
    })); // reboot the server
  done();
});

// -* Build JavaScript 
gulp.task("js:build", function (done) {
  gulp
    .src(paths.src.js) // get the common.js file
    .pipe(plumber()) // to track errors
    .pipe(rigger()) // import all specified files into common.js
    .pipe(gulp.dest(paths.build.js))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sourcemaps.init()) // initialize sourcemap
    .pipe(uglify()) // minimizing js
    .pipe(sourcemaps.write("./")) //  write sourcemap
    .pipe(gulp.dest(paths.build.js)) // put in the finished file
    .pipe(browserSync.reload({
      stream: true
    })); // reboot the server
  done();
});

// -* Copy Fonts
gulp.task("fonts:build", function (done) {
  gulp.src(paths.src.fonts).pipe(gulp.dest(paths.build.fonts));
  done();
});

// -* Process Images
gulp.task('image:build', function (done) {
  gulp
      .src(paths.src.img) // source image path
      .pipe(
          cache(
              imagemin([
                  // image compression
                  imagemin.gifsicle({ interlaced: true }),
                  jpegrecompress({
                      progressive: true,
                      max: 90,
                      min: 80,
                  }),
                  pngquant(),
                  imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
              ])
          )
      )
      .pipe(gulp.dest(paths.build.img)) // uploading finished files
      .pipe(
          imagemin([
              webp({
                  quality: 85,
              }),
          ])
      )
      .pipe(extReplace('.webp'))
      .pipe(gulp.dest(paths.build.img)); // webp
      done();
});

// -* Delete Build Delectory
gulp.task("clean:build", function (done) {
  del.sync(paths.clean);
  done();
});

// -* Clear Cache
gulp.task("cache:clear", function (done) {
  cache.clearAll();
  done();
});

// -* Build Task
gulp.task(
  "build",
  gulp.parallel([
    "clean:build", // Delete the "build" directory
    "html:build", // Compile all HTML files and place onto "build"
    "image:build", // Process all images
    "css:build", // Process SASS+CSS
    "js:build",
    "svg-make",
    "fonts:build",
    // "svg:clone",
    "fonts:build",
  ])
);

// -* Watch Task Done
gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
    browser: "chrome",
  });

  gulp
    .watch(
      [
        paths.watch.html,
        paths.watch.css,
        paths.watch.js,
        paths.watch.img,
        paths.watch.fonts,
        paths.watch.partials,
      ],
      gulp.parallel([
        "html:build",
        "css:build",
        "js:build",
        "image:build",
        "fonts:build",
      ])
    )
    .on("change", browserSync.reload);
});

// -* Default task
// -* Run "build" and "watch" tasks
gulp.task("default", gulp.parallel(["build", "watch"]));
// gulp.task("default", gulp.parallel(["build"]));