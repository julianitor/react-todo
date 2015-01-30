var React = require('../lib/react'),
    d = require('../lib/redact').d,
    models = require('./models'),
    controllers = require('./controllers'),
    _ = require('mori'),
    sender = require('./dispatcher').sender;

// TODO Header

var todoHeader = function(state) {
  return d('header', {class: 'todo-header'},
           d('input', {type: 'text', placeholder: 'Add item', id: 'focus',
                       events: {keypress: sender('input:keypress')}}));
};

// TODO List

var todoItem = function(todo) {
  return d('li', {class: _.get(todo, 'done')? 'done' : '',
                  events: {click: sender('item:toggle', todo)}},
           d('input', {type: 'checkbox'}),
           d('label', null, _.get(todo, 'caption')),
           d('a', {class: 'close', href: '#',
                   events: {click: sender('item:remove', todo)}},
             d('span', {class: 'icon icon-close'})));
};

var todoList = function(state) {
  var filter = models.ui.filter('get', state),
      items = models.todos.getFiltered(state, filter);
  return d('ul', {class: 'todo-list'},
           _.toJs(_.map(d.bind(null, todoItem), items)));
};

// TODO Footer

var todoCounter = function(state) {
  var n = _.count(models.todos.getFiltered(state, 'active'));
  return d('a', {class: 'remaining active', href: '#'},
           d('span', null, n + ' Items left'));
};

var todoToggleButtons = function(state) {
  var filter = models.ui.filter('get', state),
      isActive = function(filter, active) {
        return filter === active? 'active' : '';
      };
  return d('span', {class: 'completed'},
           d('a', {class: isActive(filter, 'all'), href: '#',
                   events: {click: sender('set:filter', 'all')}},
             d('span', null, 'All ')),
           d('a', {class: isActive(filter, 'active'), href: '#',
                   events: {click: sender('set:filter', 'active')}},
             d('span', null, 'Active ')),
           d('a', {class: isActive(filter, 'done'), href: '#',
                   events: {click: sender('set:filter', 'done')}},
             d('span', null, 'Completed ')));
};

var todoClearButton = function(state) {
  return d('a', {class: 'completed clear', href: '#',
                 events: {click: sender('clear:all')}},
           d('span', {class: 'icon icon-bin'}),
           d('span', null, 'Clear All'));
};

var todoFooter = function(state) {
  return d('footer', {class: 'todo-footer'},
           d(todoCounter, state),
           d(todoToggleButtons, state),
           d(todoClearButton, state));
};

// TODO Box layout

var TodoBox = React.createClass({displayName: "TodoBox",
  render: function() {
    console.log(this.props)
    return d('section', {class: 'todo panel'},
           d(todoHeader, this.props.state),
           d('div', {class: 'todo-main'},
             d(todoList, this.props.state)),
           d(todoFooter, this.props.state));
  }
});

// General Page Layout

var Layout = React.createClass({displayName: "Layout",
  render: function() {
    console.log(this.props)
    return (React.createElement("div", {className: "wrapper"}, 
           React.createElement("h1", {className: "centered"}, " To Do "), 
           React.createElement(TodoBox, {state: this.props.state})
           ));
  }
});

module.exports = {
  layout: Layout
};
