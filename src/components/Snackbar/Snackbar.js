import React from 'react';
import './Snackbar.scss';

import MuiSnackbar from '@material-ui/core/Snackbar';
import MuiSnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

import PropTypes from 'prop-types';
import clsx from 'clsx';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function Snackbar (props) {
  const {
    className,
    variant,
    message,
    onClose,
    hasClose,
    icon,
    anchorOrigin,
    open,
    classes: propClasses,
    contentProps,
    ...other
  } = props;

  const classes = useStyles();
  const Icon = icon ? icon : variantIcon[variant];

  return (
    <MuiSnackbar
      className={clsx('Snackbar', className)}
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      classes={propClasses}
      {...other}
    >
      <MuiSnackbarContent
        className={clsx('SnackbarContent', classes[variant])}
        message={
          <span className={classes.message}>
            {icon ? <Icon className={clsx(classes.icon, classes.iconVariant)} /> : null}
            {message}
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
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
};
Snackbar.defaultProps = {
};

export default Snackbar;
