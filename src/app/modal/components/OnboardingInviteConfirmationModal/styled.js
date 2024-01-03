import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 40px 45px;
  background-color: ${palette.white};
`;

export const Image = styled.img`
  display: block;
  width: 64px;
  height: 37px;
`;

export const Description = styled.p`
  margin-bottom: 0;
  padding: 0 ${spacing.regular};
  color: ${palette.mediumGrey};
  font-family: ${typography.text};
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regular};
  text-transform: uppercase;
`;
