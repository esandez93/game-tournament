import React, { Component } from 'react';
import './Login.scss';

import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { LoginContext } from '../../context';

class Login extends Component {
  render() {
    return this.props.logged ?
      <Redirect to='/' /> :
      <div className="Login">
        Login Page
      </div>
  }
}

Login.propTypes = {

};
Login.defaultProps = {

};

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) => <Login {...props} logged={login.logged} ref={ref} />}
  </LoginContext.Consumer>
));