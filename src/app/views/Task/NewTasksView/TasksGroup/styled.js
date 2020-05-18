import { Collapse } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const TasksGroupActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TasksGroupActionButton = styled.button`
  display: ${props => (props.isDisplayed ? 'flex' : 'none')};
  align-items: center;
  cursor: pointer;
  padding: 0 ${spacing.smallPlus};
  color: ${palette.lightGrey};

  &:last-of-type {
    padding-right: 0px;
  }

  & > p {
    margin-bottom: 0px;
    margin-left: ${spacing.tiny};
  }
`;

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const ViewIcon = styled.img`
  margin-left: ${spacing.regularPlus};
  visibility: ${props => (props.isHidden ? 'hidden' : 'visible')};
  cursor: ${props => (props.isHidden ? 'initial' : 'pointer')};
`;

export const TasksGroupContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${spacing.giga};
`;

export const TasksGroupHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.regular};

  .action-buttons {
    visibility: hidden;
  }

  &:hover {
    .action-buttons {
      visibility: visible;
    }
  }
`;

export const TasksGroupLabel = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const TasksGroupLabelName = styled.span`
  display: inline-block;
  max-width: calc(100% - 40px);
  padding-right: ${spacing.tiny};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const TasksGroupLabelCounter = styled.span`
  display: inline-block;
  width: 40px;
  vertical-align: middle;
`;

export const Tasks = styled(Collapse)`
  height: 300px;
  padding-left: ${props => props.isSubtasks && spacing.giga};
`;

export const GroupNameSectionWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const MoveUpIcon = styled.img`
  transform: rotate(-180deg);
`;
