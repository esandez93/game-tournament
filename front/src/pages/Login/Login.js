import React, { Fragment, useState, useEffect } from 'react';
import './Login.scss';
import styles from './styles';

import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { checkToken } from '@/api/auth';
import {
  Button,
  Input
} from '@/components';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import {
  LocaleContext,
  LoginContext
} from '@/context';

const useStyles = makeStyles(styles);

// TODO: Remember me + reset password
function Login (props) {
  const {
    className,
    translate,
    staticContext,
    login,
    ...other
  } = props;

  const [ checked, setChecked ] = useState(false);
  useEffect(() => {
    checkToken()
      .then(() => {
        props.history.push('/');
      })
      .catch(() => {
        setChecked(true);
      });
  }, []);

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

  return (
    <div className={clsx('Login', className)} {...other}>
      {checked && <div className={clsx(classes.root)}>
        <form className={clsx(classes.form, moreClasses.form)} noValidate>
          <Typography className={clsx(classes.title)}>Sign in</Typography>
          <Input
            id="username"
            label={translate('user.username')}
            value={values.username}
            onChange={handleChange('username')}
          />
          <Input
            id="password"
            label={translate('user.password')}
            value={values.password}
            onChange={handleChange('password')}
            type="password"
          />

          <Button className={classes.button} color="primary" variant="contained" onClick={() => login(values)}>
            {translate('sections.login')}
          </Button>
        </form>

        <Typography className={clsx(classes.signup)}>
          <Trans i18nKey="login.signup">
            You don't have an account? <Link to="/signup" style={{ fontWeight: 'bold' }}>REGISTER HERE</Link>
          </Trans>
        </Typography>
      </div>}
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
