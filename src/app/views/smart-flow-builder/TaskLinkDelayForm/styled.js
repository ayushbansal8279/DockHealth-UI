import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontWeights } from 'styles/font';

export const DelayPeriodForm = styled.form`
  width: 320px;
`;

export const CheckboxLabel = styled.label`
  font-family: ${typography.text};
  color: ${palette.mediumGrey};
`;

export const Title = styled.p`
  margin-bottom: 0;
  font-weight: ${fontWeights.bold};
  font-family: ${typography.text};
  color: ${palette.mediumGrey};
`;
