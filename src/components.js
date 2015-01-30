var React = require('../lib/react'),
    d = require('../lib/redact').d,
    models = require('./models'),
    controllers = require('./controllers'),
    _ = require('mori'),
    sender = require('./dispatcher').sender;

// TODO Header

var TodoHeader = React.createClass({
  render: function() {
    return (<header className='todo-header'>
             <input type='text' placeholder='Add item' id='focus'
                         onKeyUp={sender('input:keypress')}/>
            </header>)
  }
});

// TODO List

var TodoItem = React.createClass({
  render: function() {
    console.log(this.props);
    var todo = this.props.todo;
    var caption = _.get(todo, 'caption');
    var done = _.get(todo, 'done')? 'done' : '';
    return (<li className={done}
                    onClick={sender('item:toggle', todo)}>
             <input type='checkbox'/>
             <label>{caption}</label>
             <a className='close' href= '#'
                     onClick={sender('item:remove', todo)}>
               <span className='icon icon-close'/>
             </a>
          </li>);
  }
});

var TodoList = React.createClass({
  render: function() {
    var filter = models.ui.filter('get', this.props.state),
      items = models.todos.getFiltered(this.props.state, filter);
    var itemViews = _.toJs(_.map(function(item){
      return <TodoItem todo={item} />
    }, items));

    return (<ul className='todo-list'>
             {itemViews}
            </ul>)
  }
});

// TODO Footer

var TodoCounter = React.createClass({
  render: function() {
    var n = _.count(models.todos.getFiltered(this.props.state, 'active'));
    return (<a className='remaining active' href='#'>
             <span> {n} Items left</span>
            </a>)
  }
});

var TodoToggleButtons = React.createClass({
  render: function() {
  var filter = models.ui.filter('get', this.props.state),
      isActive = function(filter, active) {
        return filter === active? 'active' : '';
      };
  var isAllActive = isActive(filter, 'all'),
      isFilterActive = isActive(filter, 'active'),
      isDoneActive = isActive(filter, 'done');

  return (<span className='completed'>
           <a className={isAllActive} href='#'
                   onClick={sender('set:filter', 'all')}>
             <span> All </span>
           </a>
           <a className={isFilterActive} href='#'
                   onClick={sender('set:filter', 'active')}>
             <span> Active </span>
           </a>
           <a className={isDoneActive} href='#'
                   onClick={sender('set:filter', 'done')}>
             <span> Completed </span>
           </a>
          </span>)
  }
});

var TodoClearButton = React.createClass({
  render: function() {
    return (<a className='completed clear' href= '#'
                     onClick={sender('clear:all')}>
               <span className='icon icon-bin'>Clear All</span>
            </a>)
  }
})

var TodoFooter = React.createClass({
  render: function() {
    return (<footer className='todo-footer'>
             <TodoCounter state={this.props.state}/>
             <TodoToggleButtons state={this.props.state}/>
             <TodoClearButton state={this.props.state}/>
           </footer>)
  }
});

// TODO Box layout

var TodoBox = React.createClass({
  render: function() {
    console.log(this.props);
    return (<section className='todo panel'>
             <TodoHeader state={this.props.state}/>
             <div className= 'todo-main'>
               <TodoList state={this.props.state}/>
             </div>
             <TodoFooter state={this.props.state}/>
           </section>)
  }
});

// General Page Layout

var Layout = React.createClass({
  render: function() {
    console.log(this.props)
    return (<div className='wrapper'>
             <h1 className='centered'> To Do </h1>
             <TodoBox state={this.props.state}/>
           </div>);
  }
});

module.exports = {
  layout: Layout
};
