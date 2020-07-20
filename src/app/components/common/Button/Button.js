import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import PropTypes from 'prop-types';
import { fontSizes, fontWeights } from 'styles/font';

const StyledButton = styled.button`
  position: relative;
  height: 2.5rem;
  min-width: 10.625rem;
  padding: ${spacing.small} ${spacing.regular};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'lowercase')};
  outline: none;
  cursor: pointer;

  & > span {
    position: relative;
    z-index: 100;
  }

  ${({ variant, color }) => {
    switch (variant) {
      case 'contained':
        return `
          border: none;
          color: ${palette.white};
          ${color === 'primary' &&
            `
              background: linear-gradient(to top right, ${palette.brightBlue}, ${palette.darkBlue});
            `}

          &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.25s ease-out;
            ${color === 'primary' &&
              `
                background: linear-gradient(to top right, ${palette.darkBlue}, ${palette.darkBlue});
              `}
          }

          &:hover {
            &:before {
              opacity: 1;
            }
          }
          `;

      case 'outlined':
        return `
            border-width: 2px;
            border-style: solid;
            background: none;
            transition: background 0.25s ease-out;
            ${color === 'primary' &&
              `
                border-color: ${palette.darkBlue};
                color: ${palette.darkBlue};
              `}

            &:before {
              background: none;
            }
        `;
      case 'text':
        return `
          border: none;
        `;
      default:
        return ``;
    }
  }}
`;

const Button = ({ children, variant, color, uppercase, onClick, type }) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      uppercase={uppercase}
      onClick={onClick}
      type={type}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'tetriary']),
  uppercase: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
};

Button.defaultProps = {
  variant: 'contained',
  color: 'primary',
  uppercase: true,
  type: 'button',
};

export default Button;
