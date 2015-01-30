// utils

var slice = Array.prototype.slice;
var concat = Array.prototype.concat;
var flatten = function(l) { return concat.apply([], l); };

// really stupid DSL

function nodeOrTextNode(n) {
  if (typeof(n) === "object")
    return n;
  else
    return {nodeType: "text", content: n};
}

function d(type) {
  switch(typeof(type)) {
  case "function": return _dComp.apply(null, arguments);
  case "string": return _dTag.apply(null, arguments);
  }
}

function _dComp(comp) {
  return comp.apply(null, slice.call(arguments, 1));
}

function _dTag(tag, attr) {
  var children = slice.call(arguments, 2);
  return {
    nodeType: "tag",
    tag: tag,
    attrs: attr || {},
    children: flatten(children).map(nodeOrTextNode)
  };
}

// rendering

function renderComponent(component) {
  return render(component());
}

function renderTextNode(node) {
  return document.createTextNode(node.content);
}

function renderAttrs(node) {
  var attrList = [];
  for (var k in node.attrs)
    attrList.push(k + "=\"" + node.attrs[k] + "\"");
  return attrList.join(" ");
}

function setEvents(node, events) {
  for (var k in events) node.addEventListener(k, events[k], false);
}

function setAttribute(node, name, value) {
  if (name === "events")
    setEvents(node, value);
  else
    node.setAttribute(name, value);
}

function renderTag(node) {
  var t = document.createElement(node.tag);
  for (var k in node.attrs) setAttribute(t, k, node.attrs[k]);
  node.children.forEach(function(c) { t.appendChild(render(c)); });
  return t;
}

function render(node) {
  switch(true) {
  case (typeof(node) === "function"): return renderComponent(node);
  case (node.nodeType === "tag"): return renderTag(node);
  case (node.nodeType === "text"): return renderTextNode(node);
  }
}

function root(component, domNode) {
  var currentNode;
  return function update() {
    var args = arguments;
    window.requestAnimationFrame(function() {
      if (currentNode) domNode.removeChild(currentNode);
      domNode.appendChild(currentNode = render(component.apply(null, args)));
    });
    return update;
  };
}

module.exports = {
  d: d,
  root: root,
  render: render
};
