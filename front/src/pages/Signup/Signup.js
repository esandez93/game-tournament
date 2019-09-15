import React, { useState, useEffect } from 'react';
import styles from './Signup.styles';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import { checkToken } from '@/api/auth';
import { register } from '@/api/users';
import {
  Button
} from '@/components';
import {
  Settings,
  UserInfo
} from '@/components/forms';
import {
  LocaleContext,
  LoginContext,
  ThemeContext
} from '@/context';

const useStyles = makeStyles(styles);

function Signup (props) {
  const {
    className,
    translate,
    login,
    logout,
    changeTheme,
    currentTheme,
    changeLocale,
    currentLocale,
    staticContext,
    ...other
  } = props;

  const classes = useStyles();
  const [ isLoading, setIsLoading ] = useState(false);

  const size = useWindowSize();
  const [ userValues, setUserValues ] = useState({});
  const [ settingsValues, setSettingsValues ] = useState({
    theme: currentTheme,
    locale: currentLocale
  });
  const [ errors, setErrors ] = useState([]);

  const moreClasses = makeStyles((theme) => ({
    forms: {
      flexDirection: size.width >= breakpoints.l ? 'row' : 'column',
      alignItems: size.width < breakpoints.l ? 'center' : 'unset'
    },
    form: {
      width: '100%',
      maxWidth: size.width < breakpoints.s ? 'none' : '450px',
      alignContent: 'center',
      padding: `${theme.spacing(2)}px`,
      margin: '0',
      marginBottom: `${theme.spacing(2)}px`
    },
    button: {
      display: 'block',
      padding: `${theme.spacing(2)}px`,
      width: size.width < breakpoints.l ? '100%' : '150px',
      maxWidth: '450px',
      margin: '0 auto'
    }
  }))();

  const handleUserChange = name => event => {
    setUserValues({ ...userValues, [name]: event.target.value });
  };
  const handleSettingsChange = name => event => {
    setSettingsValues({ ...settingsValues, [name]: event.target.value });
  };

  // TODO: Improve validation in real time integrated in TextField
  // Also add email and extra checks
  function clickSignup () {
    // setErrors([]);
    const _errors = [];
    Object.keys(userValues).forEach((key) => {
      if (userValues[key] === '') {
        _errors.push(key);
      }
    });
    setErrors(_errors);

    if (_errors.length === 0 && userValues.password !== userValues.repeatPassword) {
      setErrors([ 'password', 'repeatPassword' ]);
    }

    if (errors.length === 0) {
      setIsLoading(true);

      register({
        ...userValues,
        settings: {
          ...settingsValues
        }
      }).then(user => {
        return login({
          username: userValues.username,
          password: userValues.password
        });
      }).then(() => {
      }).catch(error => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }

  function hasError (field) {
    return errors.includes(field);
  }

  return (
    <div className={clsx('Signup', className)} {...other}>
      <div className={clsx(classes.root)}>
        <div className={clsx(classes.forms, moreClasses.forms)}>
          <UserInfo
            className={{
              [ moreClasses.form ]: size.width < breakpoints.l
            }}
            handleChange={handleUserChange}
            setErrors={setErrors}
            hasError={hasError}
            values={userValues}
            isLoading={isLoading}
          />

          <Settings
            className={{
              [ moreClasses.form]: size.width < breakpoints.l
            }}
            handleChange={handleSettingsChange}
            isLoading={isLoading}
          />
        </div>

        <Button className={clsx(moreClasses.button)} color="primary" variant="contained" onClick={clickSignup}>
          {translate('Signup')}
        </Button>
      </div>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) =>
      <LoginContext.Consumer>
        {(login) =>
          <ThemeContext.Consumer>
            {(theme) => <Signup {...props}
              translate={locale.translate}
              login={login.login}
              logout={login.logout}
              changeTheme={theme.changeTheme}
              currentTheme={theme.name}
              changeLocale={locale.changeLocale}
              currentLocale={locale.locale}
              ref={ref} />
            }
          </ThemeContext.Consumer>
        }
      </LoginContext.Consumer>
    }
  </LocaleContext.Consumer>
));
