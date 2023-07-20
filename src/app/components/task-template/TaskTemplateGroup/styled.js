import styled from 'styled-components';
import { Collapse } from '@mui/material';
import spacing from 'styles/spacing';

export const TaskTemplateGroupContainer = styled.div`
  flex-direction: column;
  margin: 0 0 ${spacing.tiny} 0;
`;

export const TaskTemplateGroupList = styled(Collapse)``;

export const QuickAddInputWrapper = styled.div`
  margin-top: -1px;
`;
