import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const CustomFieldsSectionContainer = styled.div`
  color: ${palette.coolGrey1};
  padding: 42px ${spacing.huge};
  border-top: 1px solid ${palette.coolGrey2};
`;

export const HidableContainer = styled.div`
  visibility: ${props => (props.visibility ? 'hidden' : 'visible')};
  max-height: ${props => (props.visibility ? '0px' : '500px')};
  opacity: ${props => (props.visibility ? 0 : 1)};
  transition: all 250ms ease-out;
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.greyBlue};
  font-weight: ${fontWeights.regularPlus};
`;
export const rowHeight = 'fit-content';

export const styleFullRow = {
  padding: '1rem 0rem',
  height: 'fit-content',
};
