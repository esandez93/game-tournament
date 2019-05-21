import React from 'react';
import './EmptyComponent.scss';
import styles from './styles.js';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

function EmptyComponent (props) {
  const {
    className,
    children,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <div className={clsx(className, classes.root)} {...other}>

    </div>
  )
}

export default EmptyComponent;
