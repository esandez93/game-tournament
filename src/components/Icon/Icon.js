import React, { Component } from 'react';
import './Icon.scss';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import styled, { css } from 'styled-components';

import { withTheme } from '@/hoc';
import {
  Offline
} from '@/icons';

const BaseIcon = styled.div`
  ${({ theme }) => {
    return css``;
  }}
`;

class Icon extends Component {
  getIcon = () => {
    switch (this.props.name) {
      case "offline":
        return <Offline />;
      default:
        return;
    }
  }

  render() {
    const {
      theme,
      className,
      ...props
    } = this.props;

    return (
      <BaseIcon
        className={clsx('Icon', className)}
        theme={theme}
        {...props}
      >
        {this.getIcon()}
      </BaseIcon>
    );
  }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
};
Icon.defaultProps = {

};

export default withTheme(Icon);
