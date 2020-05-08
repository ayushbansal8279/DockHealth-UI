import { Collapse } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  margin-left: ${spacing.tiny};
  margin-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const TasksGroupContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const TasksGroupLabel = styled.label`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const Tasks = styled(Collapse)`
  height: 300px;
  background-color: blue;
`;
