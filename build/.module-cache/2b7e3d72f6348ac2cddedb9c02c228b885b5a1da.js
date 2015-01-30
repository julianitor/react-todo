var _ = require('mori');

var model = function(path, extra) {
  var m = function(op, state) {
    var args = [].slice.call(arguments, 2);
    return _[op + 'In'].apply(_, [state, path].concat(args));
  };
  for (var k in extra) m[k] = extra[k];
  return m;
};

var models = {
  ui: {
    filter: model(['ui', 'filter'])
  },
  todos: model(['data', 'todos'], {
    insert: function(state, txt) {
      var todo = _.hashMap('stamp', Date.now(),
                           'caption', txt,
                           'done', false);
      return models.todos('update', state, function(todos) {
        return _.conj(todos, todo);
      });
    },
    getFiltered: function(state, filter) {
      var filters = {
        'all': function() { return true; },
        'active': function(t) { return !_.get(t, 'done'); },
        'done': function(t) { return _.get(t, 'done'); }
      };
      return _.filter(filters[filter], models.todos('get', state));
    }
  })
};

module.exports = models;
