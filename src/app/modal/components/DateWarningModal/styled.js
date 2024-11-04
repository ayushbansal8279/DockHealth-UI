import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ width }) => width || '450px'};
  max-width: 100vw;
  font-family: inherit;
  background-color: white;
`;

export const ModalIconContainer = styled.div`
  padding: ${spacing.largePlus};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalHeaderName = styled.div`
  font-family: Outfit;
  font-size: 22px;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
`;

export const ModalDescriptionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.large};
  align-self: stretch;
  color: ${palette.black};
  text-align: center;
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 25px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: ${spacing.small} ${spacing.largePlus} ${spacing.largePlus};
  margin-left: ${spacing.largePlus};
`;
