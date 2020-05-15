import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const PrioritySwitch = styled.button`
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  cursor: pointer;

  & > img {
    &.low {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const AddCrossIcon = styled.img`
  border: 0.0625rem dashed ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.blueOcean};
  width: ${props => props.size};
`;

export const CircleIcon = styled.img`
  margin-right: ${spacing.smallPlus};
`;

export const Description = styled.div`
  cursor: pointer;
`;

export const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DueDate = styled.span`
  bottom: 0;
  color: ${palette.white};
  font-size: ${fontSizes.small};
  position: absolute;
  text-align: center;
  width: 100%;
`;

export const DueDateContainer = styled.div`
  position: relative;
`;

export const GridImg = styled(Grid)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const SubtasksGroupLabel = styled.span`
  color: ${palette.lightGray};
  font-size: ${fontSizes.small};
  cursor: pointer;
`;

export const TaskItemCell = styled.div`
  position: relative;
  align-items: center;
  border-right: 1px solid ${palette.coolGrey3};
  color: ${palette.mediumGrey};
  display: flex;
  font-size: 14px; //per design
  font-weight: ${props =>
    props.bolded ? fontWeights.bold : fontWeights.light};
  min-width: ${props => props.width};
  padding: ${spacing.smallPlus} 0;
  padding-left: ${props =>
    props.padding ? spacing[props.padding] : spacing.regularPlus};
  padding-right: ${spacing.regularPlus};
  width: ${props => (!props.width ? '100%' : '')};
  justify-content: ${props => props.justify || 'flex-start'};

  &:last-of-type {
    border-right: 0;
  }
`;

export const TaskItemContainer = styled.div`
  position: relative;
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const StatusBar = styled.div`
  background-color: ${props => props.color};
  height: 100%;
  left: 0;
  position: absolute;
  width: 6px;
`;

export const TaskIconsBox = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`;

export const TaskItemPanel = styled.div`
  position: relative;
  ${props =>
    props.isDragging && 'box-shadow: 0px 0px 11px rgba(204, 204, 204, 0.8)'}
`;

export const ThreeDots = styled.img`
  position: absolute;
  left: ${spacing.small};
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;

  &:hover,
  &:active {
    opacity: 1;
  }
`;
