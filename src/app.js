var React = require('../lib/react.js'),
    state = require('./state_atom'),
    R$ = require('../lib/redact.js'),
    Layout = require('../build/components').layout,
    mori = require('mori'),
    // just to add them to the bundle.js
    controllers = require('./controllers');

window.onload = function() {

  state.swap(mori.toClj({
    ui: {filter: 'all'},
    data: {todos: []}
  }));

  React.render(<Layout state={state.get()}/>, document.getElementById('main'));
  var setFocus = function() { document.getElementById('focus').focus(); };
  setTimeout(setFocus, 0);

};
