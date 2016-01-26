var defaultClickRejectionStrategy = require("./defaultClickRejectionStrategy");

module.exports = function injectTapEventPlugin (strategyOverrides) {
  strategyOverrides = strategyOverrides || {}
  var shouldRejectClick = strategyOverrides.shouldRejectClick || defaultClickRejectionStrategy;

  require('react/lib/EventPluginHub').injection.injectEventPluginsByName({
    "TapEventPlugin":       require('./TapEventPlugin.js')(shouldRejectClick)
  });
};
