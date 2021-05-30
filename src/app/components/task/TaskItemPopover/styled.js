/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Button = styled.button`
  cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'initial')};

  ${({ fullWidth }) =>
    fullWidth &&
    `
      width: 100%; 
      text-align: left;
    `}
`;
