module.exports = function injectTapEventPlugin () {
  require('react/lib/EventPluginHub').injection.injectEventPluginsByName({
    "TapEventPlugin":       require('./TapEventPlugin.js')
  });
};
