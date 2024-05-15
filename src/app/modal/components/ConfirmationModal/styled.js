import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const ConfirmationContainer = styled.div`
  width: 571px;
  padding: 42px 75px; // per design
  background-color: ${palette.white};
`;

export const Description = styled.p`
  margin-bottom: 0;
  text-align: center;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
`;

export const Image = styled.img`
  display: block;
  height: 64px;
  margin: 0 auto ${spacing.huge};
`;
