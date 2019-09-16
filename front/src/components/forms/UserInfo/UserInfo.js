import React, { useState } from 'react';
import styles from '../forms.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
  Form
} from '@/components';
import {
  LocaleContext
} from '@/context';

const useStyles = makeStyles(styles);

function UserInfo(props) {
  const {
    className,
    translate,
    values,
    handleChange,
    setErrors,
    hasError,
    isLoading,
    ...other
  } = props;

  const classes = useStyles();

  const [ userValues, setUserValues ] = useState({
    name: values.name || '',
    username: values.username || '',
    email: values.email || '',
    password: '',
    repeatPassword: ''
  });

  const handleUserChange = name => event => {
    if (handleChange) {
      handleChange(name)(event);
    }

    setUserValues({ ...userValues, [name]: event.target.value });
  };

  const userForm = [{
    type: 'input',
    inputType: 'text',
    label: translate('Name'),
    value: userValues.name,
    onChange: handleUserChange('name'),
    required: true,
  }, {
    type: 'input',
    inputType: 'text',
    label: translate('Username'),
    value: userValues.username,
    onChange: handleUserChange('username'),
    required: true,
  }, {
    type: 'input',
    inputType: 'email',
    label: translate('Email'),
    value: userValues.email,
    onChange: handleUserChange('email'),
    required: true,
  }, {
    type: 'input',
    inputType: 'password',
    label: translate('Password'),
    value: userValues.password,
    onChange: handleUserChange('password'),
    required: true,
  }, {
    type: 'input',
    inputType: 'password',
    label: translate('Repeat Password'),
    value: userValues.repeatPassword,
    onChange: handleUserChange('repeatPassword'),
    required: true,
  }];

  // TODO: Avatar uploading or src at least
  return (
    <Form
      className={clsx(classes.form)}
      title={translate('User Info')}
      fields={userForm}
      isLoading={isLoading}
    />
  );
}

UserInfo.propTypes = {
  isLoading: PropTypes.bool,
  values: PropTypes.object,
  handleChange: PropTypes.func
};
UserInfo.defaultProps = {
  isLoading: false,
  values: {}
};

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) =>
      <UserInfo {...props}
        translate={locale.translate}
        ref={ref}
      />
    }
  </LocaleContext.Consumer>
));
