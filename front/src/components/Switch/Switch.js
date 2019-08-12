import React from 'react';
import styles from './Switch.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
  FormControlLabel,
  Switch as MuiSwitch
} from '@material-ui/core';

const useStyles = makeStyles(styles);

function Switch (props) {
  const {
    checked,
    label,
    onChange,
    value
  } = props;

  const classes = useStyles();

  return (
    <FormControlLabel
      control={
        <MuiSwitch
          focusVisibleClassName={classes.focusVisible}
          disableRipple
          classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
          }}
          checked={checked}
          onChange={onChange}
          value={value}
        />
      }
      label={label}
    />
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func
};

Switch.defaultProps = {
  checked: false
};

export default Switch;
