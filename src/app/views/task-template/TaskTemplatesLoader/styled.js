/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const TaskTemplateLoader = styled.div`
  width: 100%;
  height: 35px;
  margin-bottom: ${spacing.smallPlus};
  background-color: ${palette.skeletonLoader};
`;
