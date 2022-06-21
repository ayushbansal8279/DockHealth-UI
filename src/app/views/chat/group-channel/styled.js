import styled from 'styled-components';
// import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
// import spacing from 'styles/spacing';

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
