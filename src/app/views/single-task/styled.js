import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const TaskViewContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  height: fit-content;
  background-color: ${palette.coolGrey4};
`;

export const SingleTaskHeaderNav = styled.div`
  @media screen and (max-width: 800px) {
    display: none;
  }
`;
