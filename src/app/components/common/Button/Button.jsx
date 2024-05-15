import React from 'react';
import { Button as MuiButton } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import PropTypes from 'prop-types';
import { fontSizes, fontWeights } from 'styles/font';
import styled from 'styled-components';

const PRIMARY = 'primary';
const PRIMARY_RED = 'primary-red';
const SECONDARY = 'secondary';
const SECONDARY_RED = 'secondary-red';
const TEXT = 'text';
const TEXT_RED = 'text-red';

const StyledButton = styled(MuiButton)`
  &&& {
    &.MuiButton-root {
      width: ${({ width }) => `${width}`};
      font-weight: ${fontWeights.regularPlus};
      font-family: 'Outfit', sans-serif;
      outline: none;
      min-width: 0;
      min-height: '30px';
      height: ${({ size }) => {
        switch (size) {
          case 'small': {
            return `30px;`;
          }
          case 'medium': {
            return `40px;`;
          }
          case 'large': {
            return `50px;`;
          }
          default: {
            return `40px`;
          }
        }
      }};
      font-size: ${({ size }) => {
        switch (size) {
          case 'small': {
            return fontSizes.smallPlus;
          }
          case 'medium': {
            return fontSizes.regular;
          }
          case 'large': {
            return fontSizes.regularPlus;
          }
          default: {
            return fontSizes.regular;
          }
        }
      }};
      padding: 0 ${spacing.regular};
      transition: opacity 0.25s;
      text-transform: ${({ uppercase }) =>
        uppercase === 'true' ? 'uppercase' : 'none'};
      cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};

      &:hover:not(:disabled) {
        background-color: ${palette.darkBlue};
        opacity: 0.8;
      }

      &:disabled {
        background: ${palette.coolGrey7};
      }
    }

    &.MuiButton-containedPrimary {
      color: ${palette.white};
      background-color: ${({ backgroundColor }) =>
        `${backgroundColor ?? palette.darkBlue}`};
      border-radius: 4px;

      &:hover:not(:disabled) {
        background-color: ${({ secondaryColor }) =>
          `${secondaryColor ?? palette.darkBlue}`};
        opacity: 0.8;
      }

      &:disabled {
        color: ${palette.white};
        background: ${palette.coolGrey7};
        border: none;
      }
    }

    &.MuiButton-containedSecondary {
      color: ${palette.white};
      background: ${palette.oPlusRed};
      border-radius: 4px;

      &:hover:not(:disabled) {
        background: ${palette.oPlusRed};
        opacity: 0.8;
      }

      &:disabled {
        color: ${palette.white};
        background: ${palette.coolGrey7};
        border: none;
      }
    }

    &.MuiButton-outlinedPrimary {
      color: ${palette.darkBlue};
      background: none;
      border: 2px solid ${palette.darkBlue};

      &:hover:not(:disabled) {
        color: ${palette.darkBlue};
        background: none;
        border: 2px solid ${palette.darkBlue};
        opacity: 0.5;
      }

      &:disabled {
        color: ${palette.coolGrey1};
        background: none;
        border-color: ${palette.coolGrey1};
      }
    }

    &.MuiButton-outlinedSecondary {
      color: ${palette.oPlusRed};
      background: none;
      border: 2px solid ${palette.oPlusRed};
      border-radius: 4px;

      &:hover:not(:disabled) {
        color: ${palette.oPlusRed};
        background: none;
        border: 2px solid ${palette.oPlusRed};
        opacity: 0.8;
      }

      &:disabled {
        color: ${palette.coolGrey1};
        background: none;
        border-color: ${palette.coolGrey1};
      }
    }

    &.MuiButton-textPrimary {
      color: ${palette.brightBlue};
      background: none;
      border: none;
      text-decoration: underline;

      &:hover:not(:disabled) {
        color: ${palette.brightBlue};
        background-color: ${palette.coolGrey4};
        border: none;
        opacity: 0.8;
      }

      &:disabled {
        color: ${palette.coolGrey1};
        background: none;
        border: none;
      }
    }

    &.MuiButton-textSecondary {
      color: ${palette.oPlusRed};
      background: none;
      border: none;
      text-decoration: underline;

      &:hover:not(:disabled) {
        color: ${palette.oPlusRed};
        background-color: ${palette.coolGrey4};
        border: none;
        opacity: 0.8;
      }

      &:disabled {
        color: ${palette.coolGrey1};
        background: none;
        border: none;
      }
    }
  }
`;

const Button = ({
  id,
  children,
  variant,
  uppercase,
  onClick,
  size,
  color,
  secondaryColor,
  type,
  width,
  disabled,
  padding,
  reference,
  startIcon,
  endIcon,
  fullWidth,
}) => {
  let muiVariant = 'contained';
  switch (variant) {
    case PRIMARY:
    case PRIMARY_RED: {
      muiVariant = 'contained';

      break;
    }
    case SECONDARY:
    case SECONDARY_RED: {
      muiVariant = 'outlined';

      break;
    }
    case TEXT:
    case TEXT_RED: {
      muiVariant = 'text';

      break;
    }
    default: {
      break;
    }
  }
  let muiColor = 'primary';
  if (
    variant === PRIMARY_RED ||
    variant === SECONDARY_RED ||
    variant === TEXT_RED
  ) {
    muiColor = 'secondary';
  }

  return (
    <StyledButton
      id={id}
      ref={reference}
      variant={muiVariant}
      color={muiColor}
      backgroundColor={color}
      secondaryColor={secondaryColor}
      uppercase={`${uppercase}`}
      onClick={onClick}
      size={size}
      type={type}
      width={width}
      disabled={disabled}
      padding={padding}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    PRIMARY,
    PRIMARY_RED,
    SECONDARY,
    SECONDARY_RED,
    TEXT,
    TEXT_RED,
  ]),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit']),
  uppercase: PropTypes.bool,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
  padding: PropTypes.number,
  id: PropTypes.string,
  reference: PropTypes.any,
};

Button.defaultProps = {
  variant: PRIMARY,
  size: 'medium',
  type: 'button',
  uppercase: true,
  disabled: false,
  width: '100%',
  startIcon: null,
  endIcon: null,
  fullWidth: false,
};

export default Button;
