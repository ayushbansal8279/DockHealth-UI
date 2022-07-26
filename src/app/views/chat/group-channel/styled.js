import styled from 'styled-components';
import palette from 'styles/palette';

export const MessageContainer = styled.div`
  height: 75vh;
`;

export const HandleBar = styled.div`
  height: 30px;
  background-color: ${palette.orange};
  &:hover {
    cursor: grab;
  }
`;
