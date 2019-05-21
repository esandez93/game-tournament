import React, { Component } from 'react';
import './Home.scss';

import clsx from 'clsx';

class Home extends Component {
  render() {
    return (
      <div className={clsx('Home', this.props.className)}>
        Home Page
      </div>
    );
  }
}

export default Home;
