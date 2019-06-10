import React from 'react';
import styles from '../forms.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import {
  Input
} from '@/components';
import {
  LocaleContext
} from '@/context';

const useStyles = makeStyles(styles);

function Settings(props) {
  const {
    className,
    translate,
    fields,
    handleUserChange,
    setErrors,
    hasError,
    values,
    ...other
  } = props;

  const classes = useStyles();

  function getInputType (field) {
    switch (field) {
      case 'email': return 'email';
      case 'password':
      case 'repeatPassword': return 'password';
      default: return 'text';
    }
  }

  // TODO: Avatar uploading or src at least
  return (
    <form className={clsx('UserInfo', className, classes.form)} noValidate {...other}>
      <Typography className={clsx(classes.formTitle)} variant="h5">{translate('signup.userInfo')}</Typography>
      {fields.map((field) => (
        <Input
          key={field}
          id={field}
          label={translate(`user.${field}`)}
          value={values[field]}
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
