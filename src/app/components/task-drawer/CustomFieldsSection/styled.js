import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const CustomFieldsSectionContainer = styled.div`
  color: ${palette.coolGrey1};
  padding: 21px 0;
  border-top: 1px solid ${palette.coolGrey2};
`;

export const CustomFieldsSectionContainerNoLine = styled.div`
  color: ${palette.coolGrey1};
  padding: 11px 41px;
`;

export const HidableContainer = styled.div`
  visibility: ${(props) => (props.visible ? 'hidden' : 'visible')};
  max-height: ${(props) => (props.visible ? '0px' : '500px')};
  opacity: ${(props) => (props.visible ? 0 : 1)};
  transition: all 250ms ease-out;
`;

export const Title = styled.h3`
  font-family: 'Outfit', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.greyBlue};
  font-weight: ${fontWeights.regularPlus};
`;
export const rowHeight = 'fit-content';

// export const styleFullRow = {
//   padding: '0.5rem 0rem',
//   height: 'fit-content',
// };

export const styleFullRow = (isMobile, extraPadding) => ({
  padding: isMobile
    ? '0.5rem 1rem'
    : extraPadding
    ? '0.5rem 2rem'
    : '0.5rem 0rem',
  height: 'fit-content',
});
