import React from 'react';
import './Avatar.scss';
import styles from './Avatar.styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import MuiAvatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(styles);

function Avatar(props) {
  const {
    className,
    src,
    name,
    size,
    ...other
  } = props;

  const classes = useStyles();

  function getFallback() {
    if (!src) {
      if (name) {
        const split = name.split(' ');

        if (split[1])
          return split[0][0].toUpperCase() + split[1][0].toUpperCase();
        else
          return name[0].toUpperCase();
      } else {
        return <PersonIcon />;
      }
    }
  }

  return (
    <MuiAvatar className={clsx('Avatar', className, {
      [ classes.small ]: size === 'small',
      [ classes.default ]: size === 'default',
      [ classes.big ]: size === 'big'
    })} src={src} {...other}>
      {getFallback()}
    </MuiAvatar>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.string
};
Avatar.defaultProps = {
  size: 'default'
};

export default Avatar;
