import styled from 'styled-components';
import palette from 'styles/palette';

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
