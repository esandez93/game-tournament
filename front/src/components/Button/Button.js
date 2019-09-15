import React, { Component } from 'react';
import './Button.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import MuiButton from '@material-ui/core/Button';

class Button extends Component {
  render() {
    const {
      className,
      children,
      ...other
    } = this.props;

    return (
      <MuiButton
        className={clsx('Button', className)}
        {...other}
      >
        { children }
      </MuiButton>
    );
  }
}
Button.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string
};
Button.defaultProps = {
  color: 'default',
  variant: 'contained'
};

export default Button;
