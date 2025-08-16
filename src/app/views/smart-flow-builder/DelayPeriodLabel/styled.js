import styled from 'styled-components';
import palette from 'styles/palette';

export const Label = styled.div`
  align-items: center;

  width: ${({ fixedWidth }) => (fixedWidth ? '180px' : 'fit-content')};
  height: fit-content;
  padding: 10px;
  line-height: 1.2;
  border-radius: 8px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
  user-select: none;
`;
