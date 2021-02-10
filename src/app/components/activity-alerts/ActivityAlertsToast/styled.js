import styled, { keyframes, css } from 'styled-components';

export const slideIn = keyframes`
  from {
    right: -500;
  }

  to {
   right: 36;
  }
`;

export const slideOut = keyframes`
  from {
    right: 36;
    opacity: 1;
  }

  to {
   right: -500;
   opacity: 0.3
  }
`;

export const ActivityAlertsToastContainer = styled.div`
  position: absolute;
  top: ${props => props.topSpacing};
  right: -500;
  z-index: 2000;
  width: 467px;
  animation: ${slideIn} 0.55s ease-in-out 1s;
  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  -o-animation-fill-mode: forwards;
  -ms-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  ${props =>
    props.isCleared
      ? css`
          animation: ${slideOut} 0.55s ease-in-out;
        `
      : ''}
`;
