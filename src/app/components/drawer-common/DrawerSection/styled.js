import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const SectionContainer = styled.div`
  width: 100%;
  // padding: 20px 42px;
  // border-top: 1px solid ${palette.coolGrey2};
`;

export const Title = styled.p`
  display: inline-block;
  margin: 0;
  color: ${palette.greyBlue};
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;
