import styled from 'styled-components';
import { Collapse } from '@mui/material';
import spacing from 'styles/spacing';

export const TaskTemplateGroupContainer = styled.div`
  flex-direction: column;
  margin: 0 0 ${spacing.tiny} 0;
  border-top: 5px solid rgba(75, 179, 253, 1);
  border-left: 1px solid rgba(75, 179, 253, 1);
  border-right: 1px solid rgba(75, 179, 253, 1);
  border-bottom: 1px solid rgba(75, 179, 253, 1);
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  background-color: #fff;
  padding-bottom: 5px;
`;

export const TaskTemplateItemsContainer = styled.div`
  position: relative;
  padding: 25px;

  & div[order='0']::before {
    display: none;
  }
`;

export const TaskTemplateItemsStartPill = styled.div`
  &:before {
    content: 'Start';
    display: inline-block;
    font-size: 12px;
    padding: 1px 10px;
    color: rgba(84, 185, 137, 1);
    background-color: rgba(223, 244, 242, 1);
    border: 1px solid rgba(84, 185, 137, 1);
    border-radius: 7px;
  }

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    margin-left: 18px;
    border-left: 1px solid rgba(175, 184, 196, 1);
  }
`;

export const TaskTemplateGroupList = styled(Collapse)``;

export const QuickAddInputWrapper = styled.div`
  margin-top: ${({ origin }) => (origin === 'PATIENT' ? '0px' : '-1px')};
  margin-bottom: ${({ isNextTaskItemTypeBundle, isAddingTask, origin }) =>
    origin === 'PATIENT'
      ? isAddingTask && !isNextTaskItemTypeBundle
        ? '10px'
        : ''
      : ''};
`;
