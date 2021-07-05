import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button as MuiButton } from '@material-ui/core';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import PropTypes from 'prop-types';
import { fontSizes, fontWeights } from 'styles/font';

const PRIMARY = 'primary';
const PRIMARY_RED = 'primary-red';
const SECONDARY = 'secondary';
const SECONDARY_RED = 'secondary-red';
const TEXT = 'text';
const TEXT_RED = 'text-red';

const StyledButton = withStyles(() => ({
  root: {
    width: ({ width }) => `${width}`,
    fontWeight: `${fontWeights.regularPlus}`,
    fontFamily: `'Montserrat', sans-serif`,
    outline: `none`,
    minWidth: 0,
    minHeight: '30px',
    height: ({ size }) => {
      switch (size) {
        case 'small':
          return `30px;`;
        case 'medium':
          return `40px;`;
        case 'large':
          return `50px;`;
        default:
          return `40px`;
      }
    },
    fontSize: ({ size }) => {
      switch (size) {
        case 'small':
          return fontSizes.smallPlus;
        case 'medium':
          return fontSizes.regular;
        case 'large':
          return fontSizes.regularPlus;
        default:
          return fontSizes.regular;
      }
    },
    padding: `0 ${spacing.regular}`,
    transition: `opacity 0.25s`,
    textTransform: ({ uppercase }) => (uppercase ? 'uppercase' : 'none'),
    cursor: ({ disabled }) => (!disabled ? 'pointer' : 'auto'),

    '&:hover:not(:disabled)': {
      backgroundColor: palette.darkBlue,
      opacity: 0.8,
    },
    '&:disabled': {
      background: `${palette.coolGrey7}`,
    },
  },
  containedPrimary: {
    color: palette.white,
    backgroundColor: palette.darkBlue,
    borderRadius: `4px`,
    '&:hover:not(:disabled)': {
      backgroundColor: palette.darkBlue,
      opacity: 0.8,
    },
    '&:disabled': {
      color: palette.white,
      background: `${palette.coolGrey7}`,
      border: `none`,
    },
  },
  containedSecondary: {
    color: palette.white,
    background: palette.oPlusRed,
    borderRadius: `4px`,
    '&:hover:not(:disabled)': {
      background: palette.oPlusRed,
      opacity: 0.8,
    },
    '&:disabled': {
      color: palette.white,
      background: `${palette.coolGrey7}`,
      border: `none`,
    },
  },
  outlinedPrimary: {
    color: palette.darkBlue,
    background: `none`,
    border: `2px solid ${palette.darkBlue}`,
    '&:hover:not(:disabled)': {
      color: palette.darkBlue,
      background: `none`,
      border: `2px solid ${palette.darkBlue}`,
      opacity: 0.5,
    },
    '&:disabled': {
      color: palette.coolGrey1,
      background: `none`,
      borderColor: palette.coolGrey1,
    },
  },
  outlinedSecondary: {
    color: palette.oPlusRed,
    background: `none`,
    border: `2px solid ${palette.oPlusRed}`,
    borderRadius: `4px`,
    '&:hover:not(:disabled)': {
      color: palette.oPlusRed,
      background: `none`,
      border: `2px solid ${palette.oPlusRed}`,
      opacity: 0.8,
    },
    '&:disabled': {
      color: palette.coolGrey1,
      background: `none`,
      borderColor: palette.coolGrey1,
    },
  },
  textPrimary: {
    color: palette.brightBlue,
    background: `none`,
    border: `none`,
    textDecoration: `underline`,
    '&:hover:not(:disabled)': {
      color: palette.brightBlue,
      backgroundColor: palette.coolGrey4,
      border: `none`,
      opacity: 0.8,
    },
    '&:disabled': {
      color: palette.coolGrey1,
      background: `none`,
      border: `none`,
    },
  },
  textSecondary: {
    color: palette.oPlusRed,
    background: `none`,
    border: `none`,
    textDecoration: `underline`,
    '&:hover:not(:disabled)': {
      color: palette.oPlusRed,
      backgroundColor: palette.coolGrey4,
      border: `none`,
      opacity: 0.8,
    },
    '&:disabled': {
      color: palette.coolGrey1,
      background: `none`,
      border: `none`,
    },
  },
}))(MuiButton);

const Button = ({
  id,
  children,
  variant,
  uppercase,
  onClick,
  size,
  type,
  fullWidth,
  width,
  disabled,
  padding,
  reference,
  startIcon,
  endIcon,
}) => {
  let muiVariant = 'contained';
  if (variant === PRIMARY || variant === PRIMARY_RED) {
    muiVariant = 'contained';
  } else if (variant === SECONDARY || variant === SECONDARY_RED) {
    muiVariant = 'outlined';
  } else if (variant === TEXT || variant === TEXT_RED) {
    muiVariant = 'text';
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
      uppercase={uppercase}
      onClick={onClick}
      size={size}
      type={type}
      fullWidth={fullWidth}
      width={width}
      disabled={disabled}
      padding={padding}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    PRIMARY,
    PRIMARY_RED,
    SECONDARY,
    SECONDARY_RED,
    TEXT,
    TEXT_RED,
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit']),
  uppercase: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  startIcon: PropTypes.string,
  endIcon: PropTypes.string,
};

Button.defaultProps = {
  variant: PRIMARY,
  size: 'medium',
  type: 'button',
  uppercase: true,
  fullWidth: false,
  disabled: false,
  width: '100%',
  startIcon: null,
  endIcon: null,
};

export default Button;
