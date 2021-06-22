import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import PropTypes from 'prop-types';
import { fontSizes, fontWeights } from 'styles/font';

const StyledButton = styled.button`
  box-sizing: border-box;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Montserrat', sans-serif;
  outline: none;
  min-width: 104px;


  & > span {
    display: inherit;
    align-items: center;
  }

  ${({ uppercase }) => uppercase && 'text-transform: uppercase'};
  ${({ disabled }) => !disabled && `cursor: pointer;`}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          height: 30px;
          padding: 0 ${spacing.regular};
          font-size: ${fontSizes.smallPlus};
        `;

      case 'medium':
        return `
          height: 40px;
          padding: 0 ${spacing.regular};
          font-size: ${fontSizes.regular};
        `;

      case 'large':
        return `
          height: 50px;
          padding: 0 ${spacing.regular};
          font-size: ${fontSizes.regular};
        `;

      default:
        return ``;
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          border: none;
          color: ${palette.white};
          background: ${palette.darkBlue};
          transition: opacity 0.25s;

          &:hover:not(:disabled) {
              opacity: 0.8;
          }

          &:disabled {
            background: ${palette.coolGrey7};
          }
          `;

      case 'primary-red':
        return `
          border: none;
          color: ${palette.white};
          background: ${palette.oPlusRed};
          transition: opacity 0.3s;

          &:hover:not(:disabled) {
              opacity: 0.8;
          }

          &:disabled {
            background: ${palette.coolGrey7};
          }
          `;

      case 'secondary':
        return `
            border-width: 2px;
            border-style: solid;
            background: none;
            color: ${palette.darkBlue};
            transition: opacity 0.3s;

            &:hover:not(:disabled) {
                opacity: 0.8;
            }
            
            &:disabled {
              color: ${palette.coolGrey1};
              border-color: ${palette.coolGrey1};
            }
        `;

      case 'secondary-red':
        return `
            border-width: 2px;
            border-style: solid;
            background: none;
            color: ${palette.oPlusRed};
            transition: opacity 0.3s;

            &:hover:not(:disabled) {
                opacity: 0.8;
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
          color: ${palette.darkBlue};`;

      default:
        return ``;
    }
  }}
`;

const Button = ({
  id,
  children,
  variant,
  uppercase,
  onClick,
  size,
  type,
  fullWidth,
  disabled,
  padding,
  reference,
}) => {
  return (
    <StyledButton
      id={id}
      ref={reference}
      variant={variant}
      uppercase={uppercase}
      onClick={onClick}
      size={size}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      padding={padding}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'primary-red',
    'secondary',
    'secondary-red',
    'text',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit']),
  uppercase: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'large',
  type: 'button',
  uppercase: true,
  fullWidth: false,
  disabled: false,
};

export default Button;
