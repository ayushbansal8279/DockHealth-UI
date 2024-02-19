import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const ViewContainer = styled.div`
  color: ${palette.mediumGrey};
  font-family: 'Outfit', sans-serif;
`;

export const Title = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const AddPersonButton = styled.button`
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regularPlus};
  font-family: inherit;
  cursor: pointer;
`;

export const FormErrorText = styled.p`
  margin-bottom: ${spacing.smallPlus};
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
`;

export const FieldStatusLabel = styled.p`
  margin-bottom: 0;
  color: ${({ isError }) => (isError ? palette.oPlusRed : palette.brightBlue)};
  font-family: inherit;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  text-transform: uppercase;
  white-space: nowrap;
`;
