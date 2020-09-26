import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const FormWrapper = styled.form`
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
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

export const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ButtonWrapper = styled.div`
  width: 265px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TileSettingsHeader = styled.h3`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const TileSettingsDescription = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  color: ${palette.lightGrey};
`;

export const ColorPickerHeader = styled.h4`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  font-family: inherit;
  color: ${palette.lightGrey};
`;

export const InitialsError = styled.p`
  margin-bottom: 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
`;
