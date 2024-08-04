import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const DescriptionTextContainer = styled.div``;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.smallPlus};
  font-family: inherit;
`;
