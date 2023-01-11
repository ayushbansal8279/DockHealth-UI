import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const HeaderContainer = styled.div`
  display: flex;
  align-self: stretch;
  border-left: 1px solid ${palette.coolGrey3};
  border-right: 1px solid ${palette.coolGrey3};
`;

export const StandardTaskItemCell = styled.div`
  position: ${({ position }) => position || 'relative'};
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-right: 1px solid ${palette.coolGrey3};
  color: ${props => props.color || palette.mediumGrey};
  display: flex;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${props =>
    props.bolded ? fontWeights.regular : fontWeights.light};
  color: ${palette.mediumGrey};
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  padding: ${spacing.small} 0;
  padding: ${props => props.padding || `${spacing.small} 0`};
  padding-left: ${props =>
    props.paddingLeft ? spacing[props.paddingLeft] : spacing.regular};
  padding-right: ${props =>
    props.paddingLeft ? spacing[props.paddingRight] : spacing.regular};
  width: ${props => (!props.width ? '100%' : '')};
  justify-content: ${props => props.justify || 'flex-start'};
  overflow: hidden;

  &:last-of-type {
    border-right: 0;
  }
`;

export const CreatedText = styled.span`
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.light};
  font-size: ${fontSizes.small};
`;
