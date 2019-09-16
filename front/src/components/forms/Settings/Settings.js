import React, { useState } from 'react';
import styles from '../forms.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import * as themes from '@/themes';
import * as locales from '@/locale';

import {
  Form
} from '@/components';
import {
  LocaleContext,
  LoginContext,
  ThemeContext
} from '@/context';

const useStyles = makeStyles(styles);

function Settings(props) {
  const {
    className,
    translate,
    currentTheme,
    changeTheme,
    currentLocale,
    changeLocale,
    handleChange,
    isLoading,
    ...other
  } = props;

  const classes = useStyles();

  const [ theme, setTheme ] = useState(currentTheme);
  const [ locale, setLocale ] = useState(currentLocale);

  const themeItems = Object.keys(themes).map((key) => ({
    text: key,
    value: key
  }));
  const localeItems = Object.keys(locales).map((key) => ({
    text: key,
    value: key
  }));

  const handleSettingsChange = name => event => {
    if (handleChange) {
      handleChange(name)(event);
    }

    if (name === 'theme') {
      setTheme(event.target.value);
      changeTheme(event.target.value);
    } else if (name === 'locale') {
      setLocale(event.target.value);
      changeLocale(event.target.value);
    }
  };

  const settingsForm = [{
    type: 'select',
    label: translate('Theme'),
    items: themeItems,
    value: theme,
    onChange: handleSettingsChange('theme')
  }, {
    type: 'select',
    label: translate('Locale'),
    items: localeItems,
    value: locale,
    onChange: handleSettingsChange('locale')
  }];

  return (
    <Form
      className={clsx(classes.form)}
      title={translate('Settings')}
      fields={settingsForm}
      isLoading={isLoading}
    />
  );
}

Settings.propTypes = {
};
Settings.defaultProps = {
};

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) =>
      <LoginContext.Consumer>
        {(login) =>
          <ThemeContext.Consumer>
            {(theme) => (
              <Settings {...props}
                translate={locale.translate}
                changeTheme={theme.changeTheme}
                currentTheme={theme.name}
                changeLocale={locale.changeLocale}
                currentLocale={locale.locale}
                ref={ref}
              />
            )}
          </ThemeContext.Consumer>
        }
      </LoginContext.Consumer>
    }
  </LocaleContext.Consumer>
));
