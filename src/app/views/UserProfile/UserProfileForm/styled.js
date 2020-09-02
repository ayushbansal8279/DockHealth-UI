import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const SectionSubtypography = styled.div`
  font-size: ${fontSizes.regular};
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: ${fontWeights.bold};
`;

export const FormInfoText = styled.p`
  margin-bottom: 0;
  padding: 0 ${spacing.regularPlus};
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const InputActionButton = styled.button`
  margin-right: ${spacing.regularPlus};
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
`;
