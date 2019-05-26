import React, { useState } from 'react';
import './Login.scss';
import styles from './styles';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Button } from '@/components';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import {
  LocaleContext,
  LoginContext
} from '@/context';

const useStyles = makeStyles(styles);

function Login (props) {
  const {
    className,
    translate,
    staticContext,
    login,
    ...other
  } = props;

  const size = useWindowSize();
  const [ values, setValues ] = useState({
    username: '',
    password: ''
  });
  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    form: {
      marginTop: size.width < breakpoints.m ? `${theme.spacing(4)}px` : `${theme.spacing(12)}px`
    }
  }))();

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  // TODO: Create Input component with built-in validation -> https://material-ui.com/components/text-fields/
  // Also with type password to set adornments (show/hide)
  return (
    <div className={clsx('Login', className)} {...other}>
      <form className={clsx(classes.form, moreClasses.form)} noValidate>
        <TextField
          id="username"
          label={translate('user.username')}
          value={values.username}
          onChange={handleChange('username')}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="password"
          label={translate('user.password')}
          value={values.password}
          onChange={handleChange('password')}
          type="password"
          margin="normal"
          variant="outlined"
        />

        <Button className={classes.button} color="primary" variant="contained" onClick={() => login(values)}>
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
