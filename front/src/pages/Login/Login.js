import React, { useState } from 'react';
import './Login.scss';

import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';

import { Button } from '@/components';
import {
  LocaleContext,
  LoginContext
} from '@/context';

function Login (props) {
  const {
    className,
    translate,
    staticContext,
    login,
    ...other
  } = props;

  const [ values, setValues ] = useState({
    username: '',
    password: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className={clsx('Login', className)} {...other}>
      <form noValidate>
        <TextField
          label={translate('user.username')}
          value={values.username}
          onChange={handleChange('username')}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label={translate('user.password')}
          value={values.password}
          onChange={handleChange('password')}
          type="password"
          margin="normal"
          variant="outlined"
        />

        <Button color="primary" variant="outlined" onClick={() => login(values)}>
          {translate('login')}
        </Button>
      </form>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) =>
      <LoginContext.Consumer>
        {(login) => <Login {...props} translate={locale.translate} login={login.login} ref={ref} />}
      </LoginContext.Consumer>
    }
  </LocaleContext.Consumer>
));
