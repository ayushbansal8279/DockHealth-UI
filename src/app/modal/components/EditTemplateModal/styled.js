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
  width: 760px;
  min-height: 480px;
  padding: ${spacing.large} ${spacing.huge};
  font-family: 'Outfit', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.p`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: inherit;
  margin-bottom: 0;
`;

export const TemplateForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

export const FormScrollingContainer = styled.div`
  flex: 1;
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
`;
