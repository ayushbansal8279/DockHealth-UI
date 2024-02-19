import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { ModalWrapper } from '../styled';

export const EditPatientListModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 600px;
  min-height: 600px;
  padding: ${spacing.regularPlus} ${spacing.largePlus};
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.huge};
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
`;

export const ButtonWrapper = styled.div`
  width: 170px;
`;

export const StyledForm = styled.form`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
`;

export const SectionTitle = styled.p`
  margin-bottom: 4px;
  font-family: 'Outfit', sans-serif;
  font-weight: ${fontWeights.bold};
`;
