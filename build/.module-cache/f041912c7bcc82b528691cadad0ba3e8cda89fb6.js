var React = require('../lib/react.js'),
    state = require('./state_atom'),
    R$ = require('../lib/redact.js'),
    components = require('./components2'),
    mori = require('mori'),
    // just to add them to the bundle.js
    controllers = require('./controllers');

window.onload = function() {

  state.swap(mori.toClj({
    ui: {filter: 'all'},
    data: {todos: []}
  }));

  var update = React.render(components.layout(state.get()),
                       document.getElementById('main')),
      setFocus = function() { document.getElementById('focus').focus(); };

  // better: debounce update
  state.addChangeListener(function(state) {
    update(state);
    setTimeout(setFocus, 0);
  });

};
