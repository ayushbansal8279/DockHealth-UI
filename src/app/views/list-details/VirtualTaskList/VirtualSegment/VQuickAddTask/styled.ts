import styled from '@mui/styled-engine';
import spacing from 'styles/spacing';

export const VQuickAddTaskContainer = styled('div')`
  display: flex;
  position: sticky;
  left: ${spacing.large};
  margin-left: 54.5px;
  margin-bottom: 1px;
  margin-top: 10px;
  // background-color: #DAEFFF;
`;

export const VQuickAddTask = styled('div')`
  width: 100%;
  font-weight: bold;
  line-height: 40px;
  // background-color: #DAEFFF;
`;

export const TaskTemplateApplicatorContainer = styled('div')`
  position: absolute;
  right: 5px;
`;
