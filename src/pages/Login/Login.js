import React, { Component } from 'react';
import './Login.scss';

import clsx from 'clsx';

class Login extends Component {
  render() {
    return (
      <div className={clsx('Login', this.props.className)}>
        Login Page
      </div>
    );
  }
}

export default Login;
