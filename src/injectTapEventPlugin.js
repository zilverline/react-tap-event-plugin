var invariant = require('fbjs/lib/invariant');
var defaultClickRejectionStrategy = require('./defaultClickRejectionStrategy');

var alreadyInjected = false;

module.exports = function injectTapEventPlugin (strategyOverrides, tapMoveThreshold) {
  strategyOverrides = strategyOverrides || {}
  var shouldRejectClick = strategyOverrides.shouldRejectClick || defaultClickRejectionStrategy;

  if (process.env.NODE_ENV !== 'production') {
    invariant(
      !alreadyInjected,
      'injectTapEventPlugin(): Can only be called once per application lifecycle.\n\n\
It is recommended to call injectTapEventPlugin() just before you call \
ReactDOM.render(). If you are using an external library which calls injectTapEventPlugin() \
itself, please contact the maintainer as it shouldn\'t be called in library code and \
should be injected by the application.'
    )
  }

  alreadyInjected = true;
  tapMoveThreshold = tapMoveThreshold || 10;

  require('react/lib/EventPluginHub').injection.injectEventPluginsByName({
    "TapEventPlugin":       require('./TapEventPlugin.js')(shouldRejectClick, tapMoveThreshold)
  });
};
