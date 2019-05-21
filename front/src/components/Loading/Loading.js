import React, { Component } from 'react';
import './Loading.scss';

import PropTypes from 'prop-types';

class Loading extends Component {
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

Loading.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.object, // Error object
    PropTypes.number // null
  ]),
  retry: PropTypes.func.isRequired,
  timedOut: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
Loading.defaultProps = {

};

export default Loading;