import React, { useState, useEffect } from 'react';
import './Login.scss';
import styles from './Login.styles';

import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { checkToken } from '@/api/auth';
import {
  Form
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

  const classes = useStyles();
  const size = useWindowSize();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ values, setValues ] = useState({
    username: '',
    password: ''
  });

  const moreClasses = makeStyles((theme) => ({
    form: {
      marginTop: size.width < breakpoints.m ? `${theme.spacing(4)}px` : `${theme.spacing(12)}px`
    }
  }))();

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const loginForm = [{
    type: 'input',
    inputType: 'text',
    label: translate('Username'),
    value: values.username,
    onChange: handleChange('username'),
    required: true
  }, {
    type: 'input',
    inputType: 'password',
    label: translate('Password'),
    value: values.password,
    onChange: handleChange('password'),
    required: true
  }];

  useEffect(() => {
    checkToken()
      .then(() => {
        props.history.push('/');
      })
      .catch(() => {
        setChecked(true);
      });
  }, []);

  function clickLogin () {
    setIsLoading(true);
    login(values)
      .then(() => {})
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={clsx('Login', className)} {...other}>
      {checked && <div className={clsx(classes.root)}>
        <Form
          className={clsx(classes.form, moreClasses.form)}
          title={<Typography className={clsx(classes.title)}>Sign in</Typography>}
          fields={loginForm}
          onSubmit={clickLogin}
          submitText={translate('Login')}
          isLoading={isLoading}
        />

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
