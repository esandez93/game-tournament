import React from 'react';
import styles from '../forms.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import {
  Select
} from '@/components';
import {
  LocaleContext
} from '@/context';

const useStyles = makeStyles(styles);

function Settings(props) {
  const {
    className,
    translate,

    themeItems,
    theme,
    handleThemeChange,

    localeItems,
    locale,
    handleLocaleChange,

    ...other
  } = props;

  const classes = useStyles();

  return (
    <form className={clsx('Settings', className, classes.form)} noValidate {...other}>
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
  );
}

Settings.propTypes = {
};
Settings.defaultProps = {
};

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) =>
      <Settings {...props}
        translate={locale.translate}
        ref={ref}
      />
    }
  </LocaleContext.Consumer>
));
