sample-express-ember-gulp
=========================

[Buy author a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WCUX27CFV79S2)

##Presentation

This project is a boilerplate described in a serie of [3 blog articles](http://jb.demonte.fr/blog/nodejs-app-with-expressjs-emberjs-stylus-jade-handlebars-jquery-gulpjs/).

It provide a complete working example of [Node.js](http://nodejs.org/), [Express.js](http://expressjs.com/), [Jade](http://jade-lang.com/), [Stylus](http://learnboost.github.io/stylus/) and [Ember.js](http://emberjs.com/) ([Handlebars.js](http://handlebarsjs.com/), [jQuery](http://jquery.com/)).

##Running the project

###Development mode

####Installation
Clone the project from github and install dependencies:
```bash
  git clone git@github.com:jbdemonte/sample-express-ember-gulp.git
  $ cd sample-express-ember-gulp/
  ~sample-express-ember-gulp$ npm install
```

####Run
Open 2 shell and run in parallel:
```bash
  $ cd sample-express-ember-gulp/
  ~sample-express-ember-gulp$  gulp watch
```
```bash
  $ cd sample-express-ember-gulp/
  ~sample-express-ember-gulp$ npm start
```
The first one will watch your JavaScript and Handlebars updates an generate each time a new <em>public/build/app.js</em> file.
The second one simply run the Express.js server

###Production mode

####Installation

Based on the installation from the development mode below, build the project:
```bash
  $ cd sample-express-ember-gulp/
  ~sample-express-ember-gulp$  gulp
```

Unzip the package on your production server:
```bash
  $ mkdir project
  $ cd project
  ~project$ unzip ../..package-*.zip
```

Install the production dependencies:
```bash
  ~project$ npm install --production
```

####Run 
Start the server:
```bash
  ~project$ npm start
```
