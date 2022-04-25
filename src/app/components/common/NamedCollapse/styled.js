import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
`;

export const Text = styled.p`
  margin-bottom: 0;
  margin-left: 10px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
  text-transform: uppercase;
`;
