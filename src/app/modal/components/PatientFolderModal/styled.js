import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { ModalWrapper } from '../styled';

export const ListFormModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 600px;
  min-height: 340px;
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.giga};
`;

export const Title = styled.h5`
  width: 100%;
  font-family: 'Outfit', sans-serif;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.darkGrey};
  text-transform: uppercase;
  text-align: left;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  width: 100%;
`;
