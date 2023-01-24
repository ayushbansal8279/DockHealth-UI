import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const PublicInfoWrapper = styled.span`
  padding-left: ${spacing.small};
`;

export const MemberGroupContainer = styled.div`
  margin-right: ${spacing.small};
`;

export const AssignMemberIconContainer = styled.div`
  cursor: pointer;
`;

export const StandardTaskItemCell = styled.div`
  position: ${({ position }) => position || 'relative'};
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-right: 1px solid ${palette.coolGrey3};
  color: ${(props) => props.color || palette.mediumGrey};
  display: flex;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${(props) =>
    props.bolded ? fontWeights.regular : fontWeights.light};
  color: ${palette.mediumGrey};
  min-width: ${(props) => props.width};
  max-width: ${(props) => props.width};
  padding: ${spacing.small} 0;
  padding: ${(props) => props.padding || `${spacing.small} 0`};
  padding-left: ${(props) =>
    props.paddingLeft ? spacing[props.paddingLeft] : spacing.regular};
  padding-right: ${(props) =>
    props.paddingLeft ? spacing[props.paddingRight] : spacing.regular};
  width: ${(props) => (props.width ? '' : '100%')};
  justify-content: ${(props) => props.justify || 'flex-start'};
  overflow: hidden;

  &:last-of-type {
    border-right: 0;
  }
`;
