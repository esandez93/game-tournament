import React, { Component } from 'react';
import './NotFound.scss';

import clsx from 'clsx';

class NotFound extends Component {
  render() {
    return (
      <div className={clsx('NotFound', this.props.className)}>
        NotFound Page
      </div>
    );
  }
}

export default NotFound;
