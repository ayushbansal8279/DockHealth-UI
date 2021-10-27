import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 42px ${spacing.huge};
  border-top: 1px solid ${palette.coolGrey2};
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;
