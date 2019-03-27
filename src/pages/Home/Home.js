import React, { Component } from 'react';
import './Home.scss';

import { Redirect } from 'react-router-dom';

import { LoginContext } from '@/context';

class Home extends Component {
  render() {
    return this.props.logged ? (
      <div className="Home">
        Home Page
      </div>
    ) : <Redirect to='/login' />
  }
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) => <Home {...props} logged={login.logged} ref={ref} />}
  </LoginContext.Consumer>
));