import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 530px;
  font-family: 'Roboto Condensed', sans-serif;
  background-color: ${palette.white};

  & > img {
    padding: ${spacing.huge};
    height: 340px;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-top: 1px solid ${palette.coolGrey2};
  height: 100%;

  & > {
    width: 314px;
  }
`;

export const ModalContentItem = styled.div`
  display: flex;
  font-size: ${fontSizes.regular};
  color: ${palette.mediumGrey};
  align-items: center;
  & > img {
    width: 14px;
    height: 14px;
    margin-right: ${spacing.tiny};
  }
`;

export const ModalIconContainer = styled.div`
  padding: ${spacing.largePlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalMainIcon = styled.img`
  cursor: default;
  margin-bottom: ${spacing.large};
`;
