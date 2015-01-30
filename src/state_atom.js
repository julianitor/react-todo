var state;
var listeners = [];

module.exports = {
  get: function() {
    return state;
  },
  swap: function(newState) {
    state = newState;
    for (var i=listeners.length; i--;) listeners[i](state);
  },
  model_swap: function(model, op) {
    var args = [].slice.call(arguments, 2),
        state = module.exports.get();
    module.exports.swap(model.apply(null, [op, state].concat(args)));
  },
  addChangeListener: function(fn) {
    listeners.push(fn);
  }
};
