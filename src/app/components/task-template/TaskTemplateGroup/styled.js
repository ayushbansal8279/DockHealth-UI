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

export const TaskTemplateGroupHeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${spacing.small} ${spacing.large};
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;

  &:hover {
    & ${TemplateHandle} {
      opacity: 1;
    }
  }
`;

export const TaskTemplateGroupHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskTemplateProgressCircle = styled.div`
  width: 48;
  height: 48;
`;

export const TaskTemplateGroupList = styled(Collapse)``;

export const TaskTemplateGroupName = styled.div`
  margin-left: ${spacing.small};
  font-size: 18px;
`;
