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

  //var update = React.render.bind(React, <Layout state={state.get()}/>, document.getElementById('main'))
  var update = function(s) {
        React.render(<Layout state={s}/>, document.getElementById('main'));
  }

  //var update = React.render(<Layout state={state_atom.get()}/>,
//  //components.layout(state.get()),
//                       document.getElementById('main')),
      setFocus = function() { document.getElementById('focus').focus(); };
  update(state.get());
  // better: debounce update
  state.addChangeListener(function(state) {
    //state.swap(state);
    update(state);
    setTimeout(setFocus, 0);
  });

};
