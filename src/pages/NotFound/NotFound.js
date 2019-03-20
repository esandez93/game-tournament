import React, { Component } from 'react';
import './NotFound.scss';

import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { LoginContext } from '../../context';

class NotFound extends Component {
  render() {
    return this.props.logged ?
      <Redirect to='/' /> :
      <div className="NotFound">
        NotFound Page
      </div>
  }
}

NotFound.propTypes = {

};
NotFound.defaultProps = {

};

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) => <NotFound {...props} logged={login.logged} ref={ref} />}
  </LoginContext.Consumer>
));