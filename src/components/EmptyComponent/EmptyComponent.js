import React, { Component } from 'react';
import './EmptyComponent.scss';

import PropTypes from 'prop-types';

class EmptyComponent extends Component {
  render() {
    return (
      <div className="EmptyComponent">

      </div>
    );
  }
}

EmptyComponent.propTypes = {

};
EmptyComponent.defaultProps = {

};

export default EmptyComponent;