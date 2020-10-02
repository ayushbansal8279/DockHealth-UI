import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  height: 780px;
  padding: ${spacing.huge};
  font-family: 'Montserrat', sans-serif;
  background-color: ${palette.white};
`;

export const TopLabel = styled.div`
  position: absolute;
  top: ${spacing.tiny};
  left: ${spacing.regular};
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.brightBlue};
`;

export const ButtonWrapper = styled.div`
  width: 265px;
`;

export const StepsContainer = styled.div`
  width: 100%;
  margin-top: ${spacing.largePlus};
  text-align: center;
`;

export const Step = styled.button`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid ${palette.coolGrey1};
  border-radius: 6px;
  cursor: pointer;
  ${({ isActive }) => isActive && `background: ${palette.coolGrey1};`}

  &:not(:first-of-type) {
    margin-left: ${spacing.tiny};
  }
`;
