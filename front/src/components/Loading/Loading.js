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
    loading,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <img className={clsx(className, classes.root, { 'hidden': !loading })} src={svg} alt="loading" {...other} />
  );
}

Loading.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool
};
Loading.defaultProps = {
  loading: true
};

export default Loading;
