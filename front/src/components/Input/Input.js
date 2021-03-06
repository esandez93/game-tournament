import React, { useState } from 'react';
import styles from './Input.styles';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  InputAdornment,
  TextField
}from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(styles);

// TODO: Create default validations by type or by validations array
function Input (props) {
  const {
    className,
    type,
    InputProps,
    ...other
  } = props;

  const classes = useStyles();

  const [ showPassword, setShowPassword ] = useState(false);
  const [ inputType, setInputType ] = useState(type);

  function handleShowPassword () {
    setInputType(inputType === 'password' ? 'text' : 'password');
    setShowPassword(inputType === 'password');
  }

  return (
    <TextField
      className={clsx(classes.root, className)}
      type={inputType}
      InputProps={{
        ...InputProps,
        endAdornment: type === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              aria-label="Toggle password visibility"
              onClick={handleShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null
      }}
      {...other}
    />
  )
}

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([ 'standard', 'outlined', 'filled' ]),
  type: PropTypes.string,
  margin: PropTypes.oneOf([ 'none', 'dense', 'normal' ]),
  InputProps: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
Input.defaultProps = {
  variant: 'outlined',
  type: 'text',
  margin: 'normal'
};

export default Input;
