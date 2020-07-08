import styled from 'styled-components';
import { Link } from 'react-router';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette, { featurePalette } from 'styles/palette';

export const ListItemLink = styled(Link)`
  color: ${palette.mediumGrey};
  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const ListLink = styled(ListItemLink)`
  max-height: 2.6rem;
  overflow: hidden;
`;

export const CompletedBy = styled.div`
  width: 100%;
  align-items: flex-end;
  display: flex;
  height: ${props => (props.isCompleted ? 1.2 : 0)}rem;
  overflow: hidden;
  padding-bottom: ${props => (props.isCompleted ? '0.1875rem' : 0)};
  transition: all 0.1s ease-out;
  transition-delay: ${props => (props.isCompleted ? '0' : '0.4')}s;

  > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regular};
    line-height: 1;
    transition: transform 0.4s ease-out;
    transition-delay: ${props => (props.isCompleted ? 0.1 : 0)}s;
    transform: translateX(${props => (props.isCompleted ? 0 : -100)}%);
  }
`;

export const PrioritySwitch = styled.button`
  position: absolute;
  top: 50%;
  left: ${props => props.left || '-12px'};
  transform: translateY(-50%);
  cursor: ${({ isClickable = true }) => (isClickable ? 'pointer' : 'initial')};
`;

export const PriorityHoverIcon = styled.img`
  opacity: 0;
`;

export const AddPlaceholder = styled.div`
  color: ${palette.mediumGrey};
  opacity: 0;
  &::first-letter {
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;

export const AddCrossIcon = styled.img`
  border: 0.0625rem dashed ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.blueOcean};
  width: ${props => props.size};
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
`;

export const Description = styled.div`
  cursor: pointer;
  width: 100%;
  margin-right: ${spacing.regularPlus};
  padding-right: ${spacing.smallPlus};
  ${props => props.isCrossedOut && 'text-decoration: line-through;'}
`;

export const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DueDate = styled.span`
  bottom: 1;
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
  ${({ isMatching }) =>
    isMatching &&
    `background: ${featurePalette.globalSearchHighlight}; opacity: .5;`}
`;

export const SmallText = styled.span`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const SubtasksGroupLabel = styled.span`
  color: ${palette.lightGray};
  font-size: ${fontSizes.regular};
  cursor: pointer;
  width: 150px;
`;

export const StandardTaskItemCell = styled.div`
  position: relative;
  align-items: center;
  border-right: 1px solid ${palette.coolGrey3};
  color: ${props => props.color || palette.mediumGrey};
  display: flex;
  font-size: ${fontSizes.regular};
  font-weight: ${props =>
    props.bolded ? fontWeights.bold : fontWeights.light};
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  padding: ${spacing.smallPlus} 0;
  padding-left: ${props =>
    props.paddingLeft ? spacing[props.paddingLeft] : spacing.regularPlus};
  padding-right: ${props =>
    props.paddingLeft ? spacing[props.paddingRight] : spacing.regularPlus};
  width: ${props => (!props.width ? '100%' : '')};
  justify-content: ${props => props.justify || 'flex-start'};

  &:last-of-type {
    border-right: 0;
  }
`;

export const ClickablePatient = styled.span`
  cursor: pointer;
`;

export const ClickableStandardTaskItemIcon = styled.span`
  cursor: pointer;
`;

export const StandardTaskItemContainer = styled.div`
  position: relative;
  background-color: ${props =>
    props.isSelected ? palette.brightBlueWithAlpha : palette.white};
  border: 1px solid ${palette.coolGrey3};
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const StatusBar = styled.div`
  background-color: ${props => props.color};
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  width: 6px;
`;

export const TaskIconsBox = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`;

export const ThreeDots = styled.img`
  position: absolute;
  left: ${spacing.smallPlus};
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;

  &:active {
    opacity: 1;
  }
`;

export const StandardTaskItemPanel = styled.div`
  position: relative;
  ${props =>
    props.isDragging && 'box-shadow: 0px 0px 11px rgba(204, 204, 204, 0.8)'};

  &:hover {
    & ${ThreeDots}, & ${AddPlaceholder}, & ${PriorityHoverIcon} {
      opacity: 1;
    }
  }
`;

export const InfoText = styled.p`
  cursor: initial;
  margin-bottom: 0;
`;

// SlimTaskItem
export const SlimTaskItemContainer = styled.div`
  display: flex;
  height: 70px;
  align-ttems: center;
  width: 100%;
  position: relative;
  background-color: white;
  padding: 0 55px;
  border-radius: ${props => (props.isDragging ? '4px' : '0px')};
  box-shadow: ${props =>
    props.isDragging ? '0px 0px 20px rgba(204, 204, 204, 0.8)' : '0px'};

  &:hover {
    & ${PriorityHoverIcon}, ${ThreeDots} {
      opacity: 1;
    }
  }
`;

export const SlimTaskItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const SlimTaskItemDescription = styled.div`
  cursor: pointer;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  min-width: 400px;
`;

export const SlimTaskItemDescriptionDetails = styled.div`
  min-width: 400px;
`;

export const SlimTaskItemParentTaskLabel = styled.div`
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey2};

  & > span {
    color: ${palette.brightBlue};
    cursor: pointer;
  }
`;

export const SlimTaskItemRightSide = styled.div`
  min-width: 240px;
  max-width: 340px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const SlimTaskItemListLink = styled(Link)`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
`;

export const OverdueBar = styled.div`
  background-image: linear-gradient(29deg, #ec4f3e 53%, #fb7c06 115%);
  padding: 2px 10px; // per design
  display: flex;
  justify-content: flex-end;
  border-radius: 81px; // per design
  font-size: ${fontSizes.regular};
  color: white;
  height: fit-content;
`;

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const MatchingWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${({ isMatching }) =>
    isMatching && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const AssigneeMatchingWrapper = styled(MatchingWrapper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 67px;
  height: 50px;
`;
