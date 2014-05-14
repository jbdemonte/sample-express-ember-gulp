var gulp = require("gulp"),
    handlebars = require("gulp-ember-handlebars"),
    streamqueue = require("streamqueue"),
    concat = require("gulp-concat"),
    stylus = require("gulp-stylus"),
    minifyCSS = require("gulp-minify-css"),
    replace = require("gulp-replace"),
    uglify = require("gulp-uglify"),
    md5 = require("MD5"),
    zip = require("gulp-zip"),
    fs = require("fs"),
    clean = require("gulp-clean"),
    runSequence = require("run-sequence"),
    pjson = require("./package.json");

/**
 * Build a single css file
 **/
gulp.task("css", function () {
    var stream = streamqueue({ objectMode: true });

    // file to add at the beginning of the generated css file
    stream.queue(
        gulp.src("public/stylesheets/normalize.css")
    );

    // compile the stylus files
    stream.queue(
        gulp
            .src("public/stylesheets/*.styl")
            .pipe(stylus())
    );

    return stream.done()
        .pipe(concat("style.css"))
        .pipe(minifyCSS())
        .pipe(gulp.dest("build/public/stylesheets/"));

});

/**
 * Build a single js file
 **/
gulp.task("js", function () {
    var stream = streamqueue({ objectMode: true });

    // Ember.js require jQuery and Handlebars to be defined first

    stream.queue(
        gulp.src("public/javascripts/vendors/jquery*.min.js")
    );

    stream.queue(
        gulp
            .src("public/javascripts/vendors/handlebars*.js")
            .pipe(uglify({preserveComments: "some"}))
    );

    // vendors libraries already minified  but jQuery already added before
    stream.queue(
        gulp.src([
            "public/javascripts/vendors/*.min.js",
            "!public/javascripts/vendors/jquery*.min.js"
        ])
    );

    // vendors libraries not already minified + Ember js files
    stream.queue(
        gulp.src([
                /* if you need more vendors libraries* /
                 "public/javascripts/vendors/*.js",
                 "!public/javascripts/vendors/*.min.js",
                 "!public/javascripts/vendors/handlebars*.js",
                 /**/
                "public/javascripts/app.js"
            ])
            .pipe(uglify({preserveComments: "some"}))
    );

    // precompile template and concat them into a virtual file (vinyl)
    stream.queue(
        gulp
            .src("public/templates/*.hbs")
            .pipe(handlebars({
                outputType: "browser"
            }))
            .pipe(uglify())
    );

    // once preprocess ended, concat result into a real file
    return stream.done()
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest("build/public/javascripts/"));

});

/**
 * Build a js file with Ember application only, used in development
 * thanks to: gulp watch
 **/
gulp.task("dev_js", function () {
    var stream = streamqueue({ objectMode: true });

    // vendors libraries not already minified + Ember js files
    stream.queue(
        gulp.src("public/javascripts/app.js")
    );

    // precompile template and concat them into a virtual file (vinyl)
    stream.queue(
        gulp
            .src("public/templates/*.hbs")
            .pipe(handlebars({
                outputType: "browser"
            }))
    );

    // once preprocess ended, concat result into a real file
    return stream.done()
        .pipe(concat("app.js"))
        .pipe(gulp.dest("public/build/javascripts/"));

});

/**
 * Build layout.jade file replacing current requirement by the built files
 */
gulp.task("layout", function () {
    var hashCss = md5(fs.readFileSync("build/public/stylesheets/style.css", "utf8")),
        hashJs = md5(fs.readFileSync("build/public/javascripts/scripts.js", "utf8")),
        replaceCss = true,
        replaceJs = true;

    fs.renameSync("build/public/stylesheets/style.css", "build/public/stylesheets/style." + hashCss + ".css");
    fs.renameSync("build/public/javascripts/scripts.js", "build/public/javascripts/scripts." + hashJs + ".js");

    return gulp.src("views/layout.jade", {base: "."})
        // replace the first css requirement and remove the others
        .pipe(replace(/\s*link\s*\(\s*rel\s*=\s*['"]stylesheet['"].*(\n\r|\n|\r)/g, function (match) {
            var result = replaceCss ? match.replace(/(href=['"])[^'"]+(['"])/, "$1stylesheets/style." + hashCss + ".css$2") : "";
            replaceCss = false;
            return result;

        }))
        // replace the first js requirement and remove the others
        .pipe(replace(/\s*script\s*\(.*(\n\r|\n|\r)/g, function (match) {
            var result = replaceJs ? match.replace(/(src=['"])[^'"]+(['"])/, "$1javascripts/scripts." + hashJs + ".js$2") : "";
            replaceJs = false;
            return result;

        }))
        .pipe(gulp.dest("build/"));
});

/**
 * Generate a zip package of the application
 */
gulp.task("zip", function () {
    var date = new Date().toISOString().replace(/[^0-9]/g, ''),
        stream = streamqueue({ objectMode: true });

    stream.queue(
        gulp.src(
            [
                "public/images/**/*",
                "routes/**/*",
                "views/**/*",
                "!views/layout.jade", // will use the built one
                "app.js",
                "package.json"
            ],
            {base: "."})
    );

    stream.queue(
        gulp.src("build/**/*", {base: "build/"})
    );

    // once preprocess ended, concat result into a real file
    return stream.done()
        .pipe(zip("package-" + pjson.version + "-" + date + ".zip"))
        .pipe(gulp.dest("dist/"));
});

/**
 * Remove build path
 */
gulp.task("clean", function () {
    return gulp.src("build", {read: false}).pipe(clean());
});

/**
 * Build the project
 */
gulp.task("default", function (callback) {
    runSequence("css", "js", "layout", "zip", "clean", callback);
});

/**
 * Watch files modifications and rebuild
 **/
gulp.task("watch", function() {
    gulp.start("dev_js");

    gulp.watch(["public/javascripts/**/*", "public/templates/**/*"], function() {
        gulp.start("dev_js");
    });
});