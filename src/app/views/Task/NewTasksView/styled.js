import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const TaskGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: ${spacing.large} ${spacing.huge};
`;

export const TaskViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-color: ${palette.coolGrey4};
`;
