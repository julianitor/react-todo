var listeners = {};

module.exports = {
  on: function(ev, cb) {
    if (!(ev in listeners)) listeners[ev] = [];
    listeners[ev].push(cb);
  },
  trigger: function(ev) {
    args = [].slice.call(arguments, 1);
    if (ev in listeners)
      for (var l=listeners[ev], i=l.length; i--;)
        l[i].apply(null, args);
    console.log('triggering:', ev, args);
  },
  sender: function() {
    var trigger = module.exports.trigger,
        args = [].slice.call(arguments);
    return trigger.bind.apply(trigger, [{}].concat(args));
  }
};
