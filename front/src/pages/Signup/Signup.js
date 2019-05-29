import React, { useState, useEffect } from 'react';
import styles from './Signup.styles';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import * as themes from '@/themes';
import * as locales from '@/locale';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import { checkToken } from '@/api/auth';
import { register } from '@/api/users';
import {
  Button,
  Input,
  Select
} from '@/components';
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
    changeTheme,
    currentTheme,
    changeLocale,
    currentLocale,
    staticContext,
    ...other
  } = props;

  const classes = useStyles();
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
  const [ userValues, setUserValues ] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [ theme, setTheme ] = useState(currentTheme);
  const [ locale, setLocale ] = useState(currentLocale);
  const [ errors, setErrors ] = useState([]);

  const userForm = [
    'name',
    'username',
    'email',
    'password',
    'repeatPassword'
  ];

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

  function getInputType (field) {
    switch (field) {
      case 'email': return 'email';
      case 'password':
      case 'repeatPassword': return 'password';
      default: return 'text';
    }
  }

  const handleUserChange = name => event => {
    setUserValues({ ...userValues, [name]: event.target.value });
  };
  const handleThemeChange = event => {
    setTheme(event.target.value);
    changeTheme(event.target.value);
  };
  const handleLocaleChange = event => {
    setLocale(event.target.value);
    changeLocale(event.target.value);
  };

  function hasError (field) {
    return errors.includes(field);
  }

  // TODO: Improve validation in real time integrated in TextField
  // Also add email and extra checks
  function clickSignup () {
    setErrors([]);
    const _errors = [];
    userForm.forEach((key) => {
      if (userValues[key] === '') {
        _errors.push(key);
      }
    });
    setErrors(_errors);

    if (_errors.length === 0 && userValues.password !== userValues.repeatPassword) {
      setErrors([ 'password', 'repeatPassword' ]);
    }

    if (errors.length === 0) {
      register({
        ...userValues,
        settings: {
          theme,
          locale
        }
      }).then((user) => {
        login({
          username: userValues.username,
          password: userValues.password
        })
      }).catch(console.error);
    }
  }

  const themeItems = Object.keys(themes).map((key) => ({
    text: key,
    value: key
  }));
  const localeItems = Object.keys(locales).map((key) => ({
    text: key,
    value: key
  }));

  // TODO: Extract forms into Components to reuse them at Config menu
  // TODO: Avatar uploading or src at least
  return (
    <div className={clsx('Signup', className)} {...other}>
      {checked && <div className={clsx(classes.root)}>
        <div className={clsx(classes.forms, moreClasses.forms)}>
          <form className={clsx(classes.form, {
            [moreClasses.form]: size.width < breakpoints.l
          })} noValidate>
            <Typography className={clsx(classes.formTitle)} variant="h5">{translate('signup.userInfo')}</Typography>
            {userForm.map((field) => (
              <Input
                key={field}
                id={field}
                label={translate(`user.${field}`)}
                value={userValues[field]}
                onChange={handleUserChange(field)}
                type={getInputType(field)}
                required
                error={hasError(field)}
                inputProps={field === 'password' ? {
                  autoComplete: "new-password"
                } : {}}
              />
            ))}
          </form>

          <form className={clsx(classes.form, {
            [moreClasses.form]: size.width < breakpoints.l
          })} noValidate>
            <Typography className={clsx(classes.formTitle)} variant="h5">{translate('sections.settings')}</Typography>
            <Select
              label={translate('settings.theme')}
              items={themeItems}
              value={theme}
              onChange={handleThemeChange}
            />
            <Select
              label={translate('settings.locale')}
              items={localeItems}
              value={locale}
              onChange={handleLocaleChange}
            />
          </form>

        </div>

        <Button className={clsx(moreClasses.button)} color="primary" variant="contained" onClick={clickSignup}>
          {translate('signup.signup')}
        </Button>
      </div>}
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
