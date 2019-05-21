import React from 'react';
import './Avatar.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import MuiAvatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

function Avatar(props) {
  const {
    className,
    src,
    name,
    ...other
  } = props;

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
    <MuiAvatar className={clsx('Avatar', className)} src={src} {...other}>
      {getFallback()}
    </MuiAvatar>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string
};
Avatar.defaultProps = {
};

export default Avatar;
