import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { ModalWrapper } from '../styled';

export const EditOrganizationModalWrapper = styled(ModalWrapper)`
  width: 643px;
  padding: 39px ${spacing.giga};
  color: ${palette.mediumGrey};
  font-family: 'Montserrat', sans-serif;
  text-align: left;
`;

export const Header = styled.h2`
  width: 100%;
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
`;

export const OrganizationForm = styled.form`
  width: 100%;
`;

export const InitialsError = styled.p`
  margin-bottom: 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
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

export const SaveButtonWrapper = styled.div`
  width: 265px;
`;
