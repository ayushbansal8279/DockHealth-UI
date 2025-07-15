import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  position: relative;
  height: 37px;
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  padding: 0 ${spacing.regular};
  cursor: pointer;
  border: 1px solid ${palette.coolGrey3};
  background: ${palette.white};

  &:last-child {
    margin-bottom: 0;
  }
  &:hover div img {
    visibility: visible;
  }
`;

export const IconsSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 22px;
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
  ${({ isCompleted }) => !isCompleted && `margin-left: 4px;`}
  opacity: ${({ isClickable }) => (isClickable ? '1' : '0.5')};
`;

export const Description = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: ${spacing.regularPlus};
  overflow: hidden;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  ${(props) => (props.isCrossedOut ? 'text-decoration: line-through;' : '')}
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

export const AssigneeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-basis: 50px;
  margin: 0 ${spacing.smallPlus};
`;

export const GoToParentIconContainer = styled.div`
  margin-left: ${spacing.smallPlus};
  cursor: pointer;
`;

export const DueDate = styled.span`
  bottom: 1px;
  color: ${palette.white};
  font-size: ${fontSizes.small};
  position: absolute;
  text-align: center;
  line-height: initial;
`;

export const DueDateContainer = styled.div`
  position: relative;
  display: flex;
  flex-basis: 78px;
  justify-content: center;
  text-align: center;
`;

export const DueDateText = styled.p`
  margin-bottom: 0;
`;

export const DragHandleContainer = styled.div`
  position: absolute;
  left: -12px;
  top: 50%;
  height: 21px;
  width: 12px;
  transform: translateY(-50%);
  padding-right: 6px;
  cursor: ${({ isDragging }) => (isDragging ? `grabbing` : `grab`)};
`;
