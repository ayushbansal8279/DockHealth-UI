import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import PropTypes from 'prop-types';
import { fontSizes, fontWeights } from 'styles/font';

const StyledButton = styled.button`
  position: relative;
  box-sizing: border-box;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  ${({ fullWidth }) => !fullWidth && 'min-width: 10.625rem;'}
  ${({ withoutMinWidth }) => withoutMinWidth && 'min-width: auto;'}

  font-weight: ${fontWeights.regularPlus};
  font-family: 'Montserrat', sans-serif;
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'lowercase')};
  outline: none;

  ${({ disabled }) => !disabled && `cursor: pointer;`}
  
  & > span {
    position: relative;
    z-index: 100;
  }
  
  ${({ size, padding }) => {
    switch (size) {
      case 'small':
        return `
          height: 30px;
          padding: ${padding || `0 ${spacing.regular}`};
          font-size: ${fontSizes.smallPlus};
        `;

      case 'medium':
        return `
          height: 50px;
          padding: ${padding || `0 ${spacing.regular}`};
          font-size: ${fontSizes.regular};
        `;

      default:
        return ``;
    }
  }}

  ${({ variant, colors, theme }) => {
    switch (variant) {
      case 'contained':
        return `
          border: none;
          color: ${palette.white};
          background: linear-gradient(to top right, ${colors.main}, ${colors.secondary});

          &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.25s ease-out;
                background: linear-gradient(to top right, ${colors.main}, ${colors.main});
          }

          &:hover {
            &:before {
              opacity: 1;
            }
          }

          &:disabled {
            background: ${palette.coolGrey1};
          }
          `;

      case 'outlined':
        return `
            border-width: 2px;
            border-style: solid;
            background: none;
            transition: background 0.25s ease-out;
            
            &:before {
              background: none;
            }
            
            ${
              theme === 'dark'
                ? `
                  border-color: ${palette.white};
                  color: ${palette.white};
                `
                : `
                  border-color: ${colors.main};
                  color: ${colors.main};
                  &:hover {
                    color: ${colors.secondary};
                    border-color: ${colors.secondary};
                  }
              `
            }

            &:disabled {
              color: ${palette.coolGrey1};
              border-color: ${palette.coolGrey1};
            }


        `;
      case 'text':
        return `
          border: none;
          text-decoration: underline;
          color: ${colors.main};
        `;
      default:
        return ``;
    }
  }}
`;

function getButtonColors(color) {
  switch (color) {
    case 'blue':
      return {
        main: palette.darkBlue,
        secondary: palette.brightBlue,
      };

    case 'red':
      return {
        main: palette.oPlusRed,
        secondary: palette.orange,
      };

    default:
      return {};
  }
}

const Button = ({
  children,
  variant,
  color,
  uppercase,
  onClick,
  size,
  type,
  fullWidth,
  disabled,
  theme,
  withoutMinWidth,
  padding,
}) => {
  return (
    <StyledButton
      variant={variant}
      colors={getButtonColors(color)}
      uppercase={uppercase}
      onClick={onClick}
      size={size}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      theme={theme}
      withoutMinWidth={withoutMinWidth}
      padding={padding}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['blue', 'red']),
  size: PropTypes.oneOf(['small', 'medium']),
  type: PropTypes.oneOf(['button', 'submit']),
  uppercase: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
};

Button.defaultProps = {
  variant: 'contained',
  color: 'blue',
  size: 'medium',
  type: 'button',
  uppercase: true,
  fullWidth: false,
  disabled: false,
  theme: 'light',
};

export default Button;
