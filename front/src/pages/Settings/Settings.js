import React, { useState, useEffect, useRef } from 'react';
import styles from './Settings.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Slide
} from '@material-ui/core';

import * as themes from '@/themes';
import * as locales from '@/locale';
import { useWindowSize } from '@/hooks';
import {
  checkPassword,
  updateUser
} from '@/api/users';
import {
  breakpoints,
  languages
} from '@/constants';
import {
  Form,
  Tabs,
  Snackbar
} from '@/components';
import {
  LoginContext,
  LocaleContext,
  ThemeContext
} from '@/context';

const useStyles = makeStyles(styles);

function Settings (props) {
  const {
    className,
    translate,
    user,
    changeUser,
    changeTheme,
    currentTheme,
    changeLocale,
    currentLocale,
    staticContext,
    ...other
  } = props;

  const size = useWindowSize();
  const classes = useStyles();

  const [ userValues, setUserValues ] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
    repeatPassword: ''
  });
  const [ theme, setTheme ] = useState(currentTheme);
  const [ locale, setLocale ] = useState(currentLocale);
  const [ lastSavedTheme, setLastSavedTheme ] = useState(currentTheme);
  const [ lastSavedLocale, setLastSavedLocale ] = useState(currentLocale);
  const [ errors, setErrors ] = useState([]);
  const [ tab, setTab ] = useState(0);
  const [ snackbar, setSnackbar ] = useState({
    open: false,
    message: null
  });
  const lastSavedThemeRef = useRef();
  const lastSavedLocaleRef = useRef();

  const tabs = [{
    label: 'User Info'
  }, {
    label: 'App Settings'
  }];

  const moreClasses = makeStyles((theme) => ({
    root: {
      paddingTop: size.width < breakpoints.m ? theme.spacing(15) : theme.spacing(12)
    },
    tabs: {
      top: size.width > 600 ? theme.spacing(8) : theme.spacing(7)
    },
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

  useEffect(() => {
    lastSavedLocaleRef.current = lastSavedLocale;
    lastSavedThemeRef.current = lastSavedTheme;
  }, [ lastSavedLocale, lastSavedTheme ]);

  useEffect(() => () => {
    changeTheme(lastSavedThemeRef.current);
    changeLocale(lastSavedLocaleRef.current);
  }, []);

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
  const handleTabChange = (event, selected) => {
    setTab(selected);
  };

  const themeItems = Object.keys(themes).map((key) => ({
    text: key,
    value: key
  }));
  const localeItems = Object.keys(locales).map((key) => ({
    text: languages[key].name,
    value: key
  }));

  function hasError (field) {
    return errors.includes(field);
  }

  function saveSettings () {
    const _user = {
      ...user,
      name: userValues.name,
      username: userValues.username,
      email: userValues.email,
      settings: {
        theme,
        locale
      }
    };

    if (tab === 0) {
      if (userValues.password === '') {
        setSnackbar({
          open: true,
          message: translate('settings.errors.noPassword')
        });
      } else {
        checkPassword(user.id, userValues.password)
          .then(() => {
            updateUser(user.id, _user)
              .then((usr) => {
                if (!usr) {
                  console.log('!usr')
                  throw new Error(translate('settings.errors.updateUser'));
                } else {
                  localStorage.setItem('user', JSON.stringify(usr));
                  changeUser(usr);
                }
              })
              .catch((err) => {
                console.log('err2', err)
                setSnackbar({
                  open: true,
                  message: translate('settings.errors.updateUser')
                });
              });
          })
          .catch((err) => {
            console.log('err1', err)
            setSnackbar({
              open: true,
              message: translate('settings.errors.checkPassword')
            });
          })
      }
    } else if (tab === 1) {
      updateUser(user.id, _user)
        .then((usr) => {
          setLastSavedLocale(locale);
          setLastSavedTheme(theme);

          if (!usr) {
            throw new Error(translate('settings.errors.updateUser'));
          } else {
            localStorage.setItem('user', JSON.stringify(usr));
            changeUser(usr);
          }
        })
        .catch((err) => {
          console.log(err)
          setSnackbar({
            open: true,
            message: translate('settings.errors.updateUser')
          });
        });
    }
  }

  const userForm = [{
    type: 'input',
    inputType: 'text',
    label: translate('user.name'),
    value: userValues.name,
    onChange: handleUserChange('name'),
    required: true,
  }, {
    type: 'input',
    inputType: 'text',
    label: translate('user.username'),
    value: userValues.username,
    onChange: handleUserChange('username'),
    required: true,
  }, {
    type: 'input',
    inputType: 'email',
    label: translate('user.email'),
    value: userValues.email,
    onChange: handleUserChange('email'),
    required: true,
  }, {
    type: 'input',
    inputType: 'password',
    label: translate('user.password'),
    value: userValues.password,
    onChange: handleUserChange('password'),
    required: true,
  }/*, {
    type: 'input',
    inputType: 'password',
    label: translate('user.repeatPassword'),
    value: userValues.repeatPassword,
    onChange: handleUserChange('repeatPassword'),
    required: true,
  }*/];

  const settingsForm = [{
    type: 'select',
    label: translate('settings.theme'),
    items: themeItems,
    value: theme,
    onChange: handleThemeChange
  }, {
    type: 'select',
    label: translate('settings.locale'),
    items: localeItems,
    value: locale,
    onChange: handleLocaleChange
  }];

  return (
    <div className={clsx('Settings', moreClasses.root, props.className)} {...other}>

      <Snackbar
        variant="error"
        direction="up"
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        TransitionComponent={Slide}
        anchorOrigin={{
          vertical: 'top',
          horizontal: size.width > breakpoints.m ? 'right' : 'center'
        }}
      />

      <div className={clsx(classes.forms, moreClasses.forms)}>
        <Tabs
          className={clsx(classes.tabs, moreClasses.tabs)}
          tabs={tabs}
          current={tab}
          onChange={handleTabChange}
          color={'secondary'}
        />

        <Form
          className={clsx(classes.form, {
            [ moreClasses.form]: size.width < breakpoints.l,
            hidden: tab !== 0
          })}
          fields={userForm}
          onSubmit={saveSettings}
          submitText={translate('forms.save')}
        />

        <Form
          className={clsx(classes.form, {
            [ moreClasses.form]: size.width < breakpoints.l,
            hidden: tab !== 1
          })}
          fields={settingsForm}
          onSubmit={saveSettings}
          submitText={translate('forms.save')}
        />
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
            {(theme) => <Settings {...props}
              translate={locale.translate}
              user={login.user}
              changeUser={login.changeUser}
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
