var React = require('../lib/react'),
    d = require('../lib/redact').d,
    models = require('./models'),
    controllers = require('./controllers'),
    _ = require('mori'),
    sender = require('./dispatcher').sender;

// TODO Header

var TodoHeader = React.createClass({displayName: "TodoHeader",
  render: function() {
    return (React.createElement("header", {className: "todo-header"}, 
             React.createElement("input", {type: "text", placeholder: "Add item", id: "focus", 
                         onKeyUp: sender('input:keypress')})
            ))
  }
});

// TODO List

var TodoItem = React.createClass({displayName: "TodoItem",
  render: function() {
    console.log(this.props);
    var todo = this.props.todo;
    var caption = _.get(todo, 'caption');
    var done = _.get(todo, 'done')? 'done' : '';
    return (React.createElement("li", {className: done, 
                    onClick: sender('item:toggle', todo)}, 
             React.createElement("input", {type: "checkbox"}), 
             React.createElement("label", null, caption), 
             React.createElement("a", {className: "close", href: "#", 
                     onClick: sender('item:remove', todo)}, 
               React.createElement("span", {className: "icon icon-close"})
             )
          ));
  }
});

var TodoList = React.createClass({displayName: "TodoList",
  render: function() {
    var filter = models.ui.filter('get', this.props.state),
      items = models.todos.getFiltered(this.props.state, filter);
    var itemViews = _.toJs(_.map(function(item){
      return React.createElement(TodoItem, {todo: item})
    }, items));

    return (React.createElement("ul", {className: "todo-list"}, 
             itemViews
            ))
  }
});

// TODO Footer

var TodoCounter = React.createClass({displayName: "TodoCounter",
  render: function() {
    var n = _.count(models.todos.getFiltered(this.props.state, 'active'));
    return (React.createElement("a", {className: "remaining active", href: "#"}, 
             React.createElement("span", null, " ", n, " +' Items left'")
            ))
  }
});

var TodoToggleButtons = React.createClass({displayName: "TodoToggleButtons",
  render: function() {
  var filter = models.ui.filter('get', this.props.state),
      isActive = function(filter, active) {
        return filter === active? 'active' : '';
      };
  var isAllActive = isActive(filter, 'all'),
      isFilterActive = isActive(filter, 'active'),
      isDoneActive = isActive(filter, 'done');
  return (React.createElement("span", {className: "completed"}, 
           React.createElement("a", {className: isAllActive, href: "#", 
                   onClick: sender('set:filter', 'all')}, 
             React.createElement("span", null, " All ")
           ), 
           React.createElement("a", {className: isFilterActive, href: "#", 
                   onClick: sender('set:filter', 'active')}, 
             React.createElement("span", null, " Active ")
           ), 
           React.createElement("a", {className: isDoneActive, href: "#", 
                   onClick: sender('set:filter', 'done')}, 
             React.createElement("span", null, " Completed ")
           )
          ))
  }
});

var TodoClearButton = React.createClass({displayName: "TodoClearButton",
  render: function() {
    return (React.createElement("a", {className: "completed clear", href: "#", 
                     onClick: sender('clear:all')}, 
               React.createElement("span", {className: "icon icon-bin"}, "Clear All")
            ))
  }
})

var TodoFooter = React.createClass({displayName: "TodoFooter",
  render: function() {
    return (React.createElement("footer", {className: "todo-footer"}, 
             React.createElement(TodoCounter, {state: this.props.state}), 
             React.createElement(TodoToggleButtons, {state: this.props.state}), 
             React.createElement(TodoClearButton, {state: this.props.state})
           ))
  }
});

// TODO Box layout

var TodoBox = React.createClass({displayName: "TodoBox",
  render: function() {
    console.log(this.props);
    return (React.createElement("section", {className: "todo panel"}, 
             React.createElement(TodoHeader, {state: this.props.state}), 
             React.createElement("div", {className: "todo-main"}, 
               React.createElement(TodoList, {state: this.props.state})
             ), 
             React.createElement(TodoFooter, {state: this.props.state})
           ))
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
