import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const FormWrapper = styled.form`
  padding: ${spacing.regularPlus};
`;

export const InfoContainer = styled.div`
  width: 100%;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const InfoHeader = styled.h4`
  margin-bottom: 0;
  color: ${palette.brightBlue};
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
`;

export const InfoText = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
`;
