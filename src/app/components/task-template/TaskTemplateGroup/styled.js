import styled from 'styled-components';
import { Collapse } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const TaskTemplateGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${spacing.small} 0;
`;

export const TemplateHandle = styled.img`
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  background-color: transparent;
  padding: ${spacing.regular} ${spacing.tiny} ${spacing.regular} 0;
  opacity: 0;

  &:active {
    opacity: 1;
  }
`;

export const Placeholder = styled.div`
  color: ${palette.mediumGrey};
  padding: 0 ${spacing.regular};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const AddPlaceholder = styled(Placeholder)`
  color: ${palette.lightGrey};
  opacity: 0;

  &::first-letter {
    color: ${palette.orange};
    font-size: 16px;
  }
`;

export const TaskTemplateGroupHeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 0 ${spacing.large};
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;
  flex: 1;

  &:hover {
    & ${TemplateHandle}, ${AddPlaceholder} {
      opacity: 1;
    }
  }
`;

export const TaskTemplateProgressCircle = styled.div`
  margin-right: ${spacing.small};
`;

export const TaskTemplateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const TaskTemplateGroupList = styled(Collapse)``;

export const TaskTemplateOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: ${spacing.smallPlus};
  width: ${({ groupHasMultipleAssignees }) =>
    groupHasMultipleAssignees ? '420px' : '390px'};
`;

export const TaskTemplateNameInput = styled.input`
  max-width: 400px;
  grid-row: 1;
  grid-column: 2;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${palette.mediumGrey};
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 5px;
  background: ${palette.coolGrey4};
  margin-left: ${spacing.small};

  &[readonly] {
    background-color: transparent;
    cursor: initial;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const TaskTemplatePatientHeader = styled.div`
  width: 164px;
`;

export const TaskTemplateRight = styled.div`
  display: flex;
  align-items: center;
`;
