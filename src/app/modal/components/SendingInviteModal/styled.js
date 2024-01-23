import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const ModalWrapper = styled.div`
  font-family: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 340px;
  height: 110px;
  background-color: ${palette.white};
`;

export const ModalLabel = styled.div`
  font-size: 18px;
  color: ${palette.mediumGrey};
  margin-left: ${spacing.regular};
`;
