var React = require('../lib/react.js'),
    state_atom = require('./state_atom'),
    R$ = require('../lib/redact.js'),
    Layout = require('../build/components').layout,
    mori = require('mori'),
    // just to add them to the bundle.js
    controllers = require('./controllers');

window.onload = function() {

  state_atom.swap(mori.toClj({
    ui: {filter: 'all'},
    data: {todos: []}
  }));

  var update = React.render(React.createElement(Layout, {state: state_atom.get()}),
  //components.layout(state.get()),
                       document.getElementById('main')),
      setFocus = function() { document.getElementById('focus').focus(); };

  // better: debounce update
  state.addChangeListener(function(state) {
    state_atom.swap(state);
    setTimeout(setFocus, 0);
  });

};
