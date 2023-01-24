import styled from 'styled-components';

export const Button = styled.button`
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

  ${({ fullWidth }) =>
    fullWidth &&
    `
      width: 100%; 
      text-align: left;
    `}
`;
