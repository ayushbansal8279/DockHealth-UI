import styled from 'styled-components';

export const Button = styled.button`
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
  height: 100%;
  ${({ fullWidth }) =>
    fullWidth &&
    `
      width: 100%; 
      text-align: left;
    `}
`;
