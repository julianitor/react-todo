var state = require('./state_atom'),
    dispatcher = require('./dispatcher'),
    _ = require('mori'),
    models = require('./models'),
    swap = state.model_swap;

// Input

var ENTER_KEY = 13;

dispatcher.on('input:keypress', function(e) {
  console.log("EY");
  if (e.keyCode === ENTER_KEY) {
    state.swap(models.todos.insert(state.get(),
                                   e.currentTarget.value));
    e.currentTarget.value = '';
  }
    
});

dispatcher.on('item:remove', function(item) {
  swap(models.todos, 'update', function(todos) {
    return _.remove(_.curry(_.equals, item), todos);
  });
});

dispatcher.on('set:filter', function(filter) {
  swap(models.ui.filter, 'assoc', filter);
});

dispatcher.on('item:toggle', function(item) {
  var todos = models.todos('get', state.get());
  todos = _.map(function(i) {
    if (_.equals(item, i))
      return _.assoc(item, 'done', !_.get(item, 'done'));
    else
      return i;
  }, todos);
  swap(models.todos, 'assoc', todos);
});

dispatcher.on('clear:all', function() {
  swap(models.todos, 'assoc', _.vector());
});
