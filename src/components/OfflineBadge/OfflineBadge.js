import React, { useState } from 'react';
import './OfflineBadge.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import OfflineIcon from '@material-ui/icons/CloudOff';
import { makeStyles } from '@material-ui/core/styles';

import {
  Snackbar
} from '../';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 0
  }
}));

function OfflineBadge (props) {
  const [open, setOpen] = useState(true);

  const {
    className,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <Snackbar
      className={clsx('OfflineBadge', className)}
      variant="error"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      icon={OfflineIcon}
      message="Offline"
      contentProps={{classes}}
      {...other}
    />
  );
}

OfflineBadge.propTypes = {
};
OfflineBadge.defaultProps = {
};

export default OfflineBadge;
