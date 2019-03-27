import React, { Component } from 'react';
import './Button.scss';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, { css } from 'styled-components';

import { withTheme } from '@/hoc';
import {
  hexToRGB,
  getContrastText
} from '@/utils/color-manipulation';

const BaseButton = styled.button`
  cursor: pointer;
  border-radius: 3px;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;

  ${({ theme, color, variant }) => {
    if (!color) { // Default
      if (!variant) {
        return css`
          color: ${getContrastText(theme.palette.grey[300])};
          background-color: ${theme.palette.grey[300]}

          :hover {
            color: ${getContrastText(theme.palette.grey[500])};
            background-color: ${theme.palette.grey[500]}
          }

          :active {
            background-color: ${theme.palette.grey[700]};
          }
        `;
      } else if (variant === "text") {
        return css`
        background: none;
        color: ${theme.palette.text.primary};

        :hover {
          background-color: rgba(${hexToRGB(theme.palette.grey[500])}, 0.1);
        }

        :active {
          background-color: rgba(${hexToRGB(theme.palette.grey[700])}, 0.25);
        }
      `;
      }
    } else { // Colored
      if (!variant) {
        return css`
          background-color: ${theme.palette[color].main};
          color: ${getContrastText(theme.palette[color].main)};

          :hover {
            background-color: ${theme.palette[color].dark};
            color: ${getContrastText(theme.palette[color].dark)};
          }

          :active {
            background-color: ${theme.palette[color].light};
          }
        `;
      } else if (variant === "text") { // Colored default
        return css`
          background: none;
          color: ${theme.palette[color].main};
  
          :hover {
            background-color: rgba(${hexToRGB(theme.palette[color].main)}, 0.1);
          }

          :active {
            background-color: rgba(${hexToRGB(theme.palette[color].dark)}, 0.25);
          }
        `;
      }
    }
  }}
`;

const isColorValid = (color) => color === 'primary' || color === 'secondary';
const isVariantValid = (variant) => variant === 'text';

class Button extends Component {
  render() {
    const {
      theme,
      className,
      onClick,
      children,
      color,
      variant,
      ...props
    } = this.props;

    return (
      <BaseButton
        className={classNames('Button', className)}
        theme={theme}
        onClick={onClick}
        color={isColorValid(color) ? color : null}
        variant={isVariantValid(variant) ? variant : null}
        {...props}
      >
        { children }
      </BaseButton>
    );
  }
}
Button.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string
};
Button.defaultProps = {
};

export default withTheme(Button);
