import { Collapse } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AddTaskInputWrapper = styled.div`
  position: relative;
  font-size: ${fontSizes.smallPlus};

  & > input {
    height: auto;
    margin-bottom: ${spacing.small};
    padding: ${spacing.regular} ${spacing.huge};
    border-color: ${palette.coolGrey3};
    font-size: 1em;

    &:focus {
      box-shadow: none;
    }
  }

  &:before {
    position: absolute;
    top: 50%;
    left: 20px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: 1em;
  }
`;

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  margin-left: ${spacing.tiny};
  margin-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const ViewIcon = styled.img`
  margin-left: ${spacing.regularPlus};
`;

export const TasksGroupContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const TasksGroupHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.regular};
`;

export const TasksGroupLabel = styled.label`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const Tasks = styled(Collapse)`
  height: 300px;
  padding-left: ${props => props.isSubtasks && spacing.giga};
`;
