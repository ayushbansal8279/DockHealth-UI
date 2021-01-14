import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  height: 37px;
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  padding: 0 ${spacing.regular};
  cursor: pointer;
  border: 1px solid ${palette.coolGrey3};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const IconsSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: ${spacing.tiny};
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 40px;
  height: 22px;
  margin-bottom: 4px;

  & img {
    margin-top: ${({ marginTop }) => marginTop || 0}px;
  }
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
  ${({ isCompleted }) => !isCompleted && `margin-left: 4px;`}
`;

export const Description = styled.div`
  display: flex;
  justify-conent: space-between;
  width: 100%;
  padding-right: ${spacing.regularPlus};
  overflow: hidden;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};

  ${props => props.isCrossedOut && 'text-decoration: line-through;'}
`;

export const DescriptionLabel = styled.div`
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.regular};
  color: rgb(193, 204, 218);
  text-decoration: none;
  margin-top: 1px;
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

export const AddCrossIcon = styled.img`
  border: 0.0625rem dashed ${palette.coolGrey1};
  border-radius: 50%;
  color: ${palette.blueOcean};
  width: ${props => props.size};
`;

export const AssigneeContainer = styled.div`
  width: 34px;
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
  width: 60px;
  justify-content: center;
  text-align: center;
`;
