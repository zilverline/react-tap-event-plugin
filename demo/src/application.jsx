import React from "react";
import { render } from "react-dom";

let lastTouchEvent = null;

var now = (function() {
  if (Date.now) {
    return Date.now;
  } else {
    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
    return function () {
      return +new Date;
    }
  }
})();

function shouldRejectClick(lastTouchEvent, clickTimestamp) {
  if (lastTouchEvent && (clickTimestamp - lastTouchEvent) < 750) {
    return true;
  }
}

function handleMouseEvent(original, handler) {
  return function(e) {
    if (original) original(e);

    if (handler && !shouldRejectClick(lastTouchEvent, now())) {
      handler(e);
    }
  }
}

function handleTouchEvent(original, handler) {
  return function(e) {
    lastTouchEvent = now();

    if (original) original(e);
    if (handler) handler(e);
  }
}

function traverse(node) {
  if (typeof(node) === "string") {
    return node;
  }

  if (typeof(node.type) === "function") {
    return React.createElement(withTouchTap(node.type), node.props, node.props.children);
  }

  const children = React.Children.map(node && node.props && node.props.children, child => {
    return traverse(child);
  });

  const originalProps = node.props || {};
  if (originalProps.onTouchTap) {
    const touchTapHandlers = originalProps.onTouchTap == null ? null : {
      onTouchStart: handleTouchEvent(originalProps.onTouchStart),
      onTouchEnd: handleTouchEvent(originalProps.onTouchEnd, originalProps.onTouchTap),
      onTouchCancel: handleTouchEvent(originalProps.onTouchCancel),
      onMouseDown: handleMouseEvent(originalProps.onMouseDown),
      onMouseUp: handleMouseEvent(originalProps.onMouseUp, originalProps.onTouchTap)
    };

    const newProps = Object.assign({}, node.props, touchTapHandlers, {ref: node.ref});
    delete newProps.onTouchTap;

    return React.createElement(node.type, newProps, children);
  } else {
    return React.cloneElement(node, null, children);
  }
}

function withTouchTap(WrappedComponent) {
  const touchTap = class TouchTap extends WrappedComponent {
    render() {
      return traverse(super.render());
    }
  }

  touchTap.displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  return touchTap;
}

class TapLink extends React.Component {
  render() {
    return <a href="#" onClick={() => console.log("nested click")} onTouchTap={() => console.log("nested touch tap")}>Tap Me</a>;
  }
}

class TapContainer extends React.Component {
  render() {
    return (
      <div>
        <TapLink />
      </div>
    );
  }
}

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <a href="#" onClick={() => console.log("click")} onTouchTap={() => console.log("touch tap")}>Tap Me</a>
        <br />
        <TapLink />
        <TapContainer />
      </div>
    );
  }
}

import Perf from 'react-addons-perf';
import injectTapEventPlugin from "react-tap-event-plugin";

const count = 1;
let measurements;

Perf.start();
const MainWithTouchTap = withTouchTap(Main);
for (let i = count; i > 0; i--) {
  render(<MainWithTouchTap title="With HOC" />, document.getElementById("container2"));
}
Perf.stop();
measurements = Perf.getLastMeasurements();
// Perf.printInclusive(measurements);
// console.log("With HOC");
// Perf.printExclusive(measurements);
// Perf.printWasted(measurements);

Perf.start();
injectTapEventPlugin();
for (let i = count; i > 0; i--) {
  render(<Main title="Original plugin" />, document.getElementById("container"));
}
Perf.stop();
measurements = Perf.getLastMeasurements();
// Perf.printInclusive(measurements);
// console.log("Original plugin");
// Perf.printExclusive(measurements);
// Perf.printWasted(measurements);

