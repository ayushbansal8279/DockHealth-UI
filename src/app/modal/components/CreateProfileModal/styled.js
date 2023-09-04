import { Checkbox } from '@mui/material';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { ModalWrapper } from '../styled';

export const AdditionalOptionLabel = styled.span`
  cursor: pointer;
`;

export const AddPatientFieldModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 700px;
  min-height: 200px;
  padding: ${spacing.large} ${spacing.huge};
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.p`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: inherit;
  margin-bottom: 0;
`;

export const FiledTypesContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  grid-gap: 28px;
`;

export const FiledTypeButton = styled.button`
  padding: 14px 6px;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
`;

export const FieldTypeImage = styled.img`
  margin-bottom: 8px;
`;

export const FiledTypeDescription = styled.p`
  min-height: 72px;
  margin-bottom: 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
`;

export const FiledTypeTitle = styled.p`
  margin-bottom: 8px;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.coolGrey1};
`;

export const FieldForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

export const FormScrollingContainer = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const InfoText = styled.p`
  margin-bottom: 0;
  font-weight: ${fontWeights.regular};
  color: ${palette.coolGrey6};
  text-transform: uppercase;
`;

export const BlueCheckbox = styled(Checkbox)`
  &&& {
    &.MuiCheckbox-root {
      color: ${palette.brightBlue};
      & .checked {
        color: ${palette.brightBlue};
      }
    }
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
