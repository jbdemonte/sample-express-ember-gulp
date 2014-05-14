/*!
 * Ember example
 * copyright Jean-Baptiste DEMONTE (jbdemonte@gmail.com)
 */
App = Ember.Application.create();

App.Router.map(function() {
    // put your routes here
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return ['red', 'yellow', 'blue'];
    }
});
