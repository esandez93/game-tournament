import React from 'react';
import './Snackbar.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  IconButton,
  Snackbar as MuiSnackbar,
  SnackbarContent as MuiSnackbarContent,
  Typography
} from '@material-ui/core';

import {
  amber,
  blue,
  green
} from '@material-ui/core/colors';

import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function Snackbar (props) {
  const {
    className,
    variant,
    message,
    onClose,
    hasClose,
    icon,
    classes: propClasses,
    contentProps,
    autoHideDuration,
    ...other
  } = props;

  const size = useWindowSize();

  const classes = makeStyles(theme => ({
    root: {
      opacity: 0.95
    },
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: blue[600]
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20,
      color: variant === 'error' ? 'white' : theme.palette.text.primary
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      color: variant === 'error' ? 'white' : theme.palette.text.primary
    },
    anchorOriginTopCenter: {
      marginTop: size.width > breakpoints.m ? '0px' : `${theme.spacing(7)}px`
    }
  }))();
  const Icon = icon ? icon : variantIcon[variant];

  return (
    <MuiSnackbar
      className={clsx('Snackbar', className, classes.root)}
      classes={{
        anchorOriginTopCenter: classes.anchorOriginTopCenter,
        ...propClasses
      }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      {...other}
    >
      <MuiSnackbarContent
        className={clsx('SnackbarContent', classes[variant])}
        message={
          <span className={classes.message}>
            {icon ? <Icon className={clsx(classes.icon, classes.iconVariant)} /> : null}
            <Typography>{message}</Typography>
          </span>
        }
        action={onClose ? [
          <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ] : null}
        {...contentProps}
      />
    </MuiSnackbar>
  );
}

Snackbar.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  autoHideDuration: PropTypes.number,
  classes: PropTypes.object
};
Snackbar.defaultProps = {
  variant: 'info',
  autoHideDuration: 5000,
  classes: {}
};

export default Snackbar;
