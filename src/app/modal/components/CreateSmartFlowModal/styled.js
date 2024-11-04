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

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.huge};
`;

export const Title = styled.h5`
  color: ${palette.offBlack};
  text-align: center;
  font-family: Outfit;
  font-size: 22px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  text-align: center;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  width: 100%;
`;
