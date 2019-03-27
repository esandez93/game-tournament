import React, { Component } from 'react';
import './OfflineBadge.scss';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, { css } from 'styled-components';

import { Icon } from '../';
import { withTheme } from '@/hoc';
import {
  hexToRGB,
  getContrastText
} from '@/utils/color-manipulation';

const BaseBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 3px;
  padding: 0.5rem 1rem;

  ${({ theme }) => {
    const rgbError = hexToRGB(theme.palette.error.main);
    const contrastText = getContrastText(theme.palette.error.main);

    return css`
      background-color: rgba(${rgbError}, 0.75);
      color: ${contrastText};
      fill: ${contrastText};
    `;
  }}
`;

class OfflineBadge extends Component {
  render() {
    const {
      className,
      theme,
      ...props
    } = this.props;

    return (
      <BaseBadge
        className={classNames('OfflineBadge', className)}
        theme={theme}
        {...props}
      >
        <Icon name="offline" />
        <span>Offline</span>
      </BaseBadge>
    );
  }
}

OfflineBadge.propTypes = {
  
};
OfflineBadge.defaultProps = {

};

export default withTheme(OfflineBadge);