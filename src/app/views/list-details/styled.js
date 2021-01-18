import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const TaskGroupsContainer = styled.div`
  margin: 0 ${spacing.huge} ${spacing.large} ${spacing.huge};
`;

export const TaskViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: ${spacing.giga};
  background-color: ${palette.coolGrey4};
`;

export const ListTourWrapper = styled.div`
  position: fixed;
  top: 150px;
  left: 50%;
  z-index: 201;
  transform: translateX(-50%);
`;

export const ListTourBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
`;
