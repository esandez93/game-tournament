import React, { Component } from 'react';
import './NotFound.scss';

import { Redirect } from 'react-router-dom';

import { LoginContext } from '@/context';

class NotFound extends Component {
  render() {
    return this.props.logged ?
      <Redirect to='/' /> :
      <div className="NotFound">
        NotFound Page
      </div>
  }
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) => <NotFound {...props} logged={login.logged} ref={ref} />}
  </LoginContext.Consumer>
));