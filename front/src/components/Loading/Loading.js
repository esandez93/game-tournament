import React from 'react';
import styles from './Loading.styles';
import svg from '@/assets/img/loading.svg';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

function Loading (props) {
  const {
    className,
    type,
    isLoading,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <div className={clsx(className, classes.root, { 'hidden': !isLoading })} {...other}>
      <img className={clsx(classes.loading)} src={svg} alt="loading" />
    </div>
  );
}

Loading.propTypes = {
  type: PropTypes.string,
  isLoading: PropTypes.bool
};
Loading.defaultProps = {
  isLoading: true
};

export default Loading;
