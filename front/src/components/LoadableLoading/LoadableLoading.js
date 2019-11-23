import React, { Component } from 'react';

import PropTypes from 'prop-types';

class LoadableLoading extends Component {
  render() {
    // All this props are injected by Loadable
    const {
      error,
      retry,
      timedOut,
      pastDelay
    } = this.props;

    if (error) {
      // When the loader has errored
      return <div>Error! <button onClick={ retry }>Retry</button></div>;
    } else if (timedOut) {
      // When the loader has taken longer than the timeout
      return <div>Taking a long time... <button onClick={ retry }>Retry</button></div>;
    } else if (pastDelay) {
      // When the loader has taken longer than the delay
      return <div>Loading...</div>;
    } else {
      // When the loader has just started
      return null;
    }
  }
}

LoadableLoading.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.object, // Error object
    PropTypes.number // null
  ]),
  retry: PropTypes.func.isRequired,
  timedOut: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
LoadableLoading.defaultProps = {

};

export default LoadableLoading;
