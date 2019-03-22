import React, { Component } from 'react';
import './Button.scss';

import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    return (
      <button className="Button" onClick={this.props.onClick}>
        { this.props.children }
      </button>
    );
  }
}
Button.propTypes = {
  onClick: PropTypes.func
};

export default Button;
