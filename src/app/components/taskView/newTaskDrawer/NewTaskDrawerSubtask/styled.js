import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.smallPlus} 0;
`;

export const MainSection = styled.div`
  display: flex;
  align-items: center;
`;

export const IconsSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 42px;
  margin-top: ${spacing.small};
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-itmes: center;
  width: 40px;
  height: 32px;
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
  ${({ isCompleted }) => !isCompleted && `margin-left: 4px;`}
`;

export const Description = styled.div`
  width: 100%;
  margin-right: ${spacing.regularPlus};
  padding-right: ${spacing.smallPlus};
  overflow-wrap: anywhere;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};

  ${props => props.isCrossedOut && 'text-decoration: line-through;'}
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
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

export const AddCrossIcon = styled.img`
  border: 0.0625rem dashed ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.blueOcean};
  width: ${props => props.size};
`;

export const AssigneeContainer = styled.div`
  widht: 42px;
  padding: 0 ${spacing.smallPlus};
`;

export const GoToParentButton = styled.button`
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
  width: 37.98px; // per design
  justify-content: center;
  text-align: center;
`;
