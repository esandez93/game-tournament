import React from 'react';
import styles from './Stat.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(styles);

function Stat (props) {
  const {
    className,
    Icon,
    title,
    label
  } = props;

  const classes = useStyles();

  return (
    <div className={clsx('Stat', className, classes.root)}>
      <div className={clsx(classes.header)}>
        {Icon && <Icon className={clsx(classes.icon)} />}
        <Typography className={clsx(classes.title)}>{title}</Typography>
      </div>

      <Typography className={clsx(classes.label)}>{label}</Typography>
    </div>
  );
}

export default Stat;
