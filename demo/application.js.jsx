var React = require("react");
var ReactDOM = require("react-dom");
injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var Main = React.createClass({
  render: function() {
    return (
      <a
        href="#"
        onTouchTap={this.handleTouchTap}
        onClick={this.handleClick}>
        Tap Me
      </a>
    );
  },

  handleClick: function(e) {
    console.log("click", e);
  },

  handleTouchTap: function(e) {
    console.log("touchTap", e);
  }
});

ReactDOM.render(<Main />, document.getElementById("container"));
