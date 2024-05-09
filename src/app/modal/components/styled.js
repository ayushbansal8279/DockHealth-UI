import { Button, IconButton } from '@mui/material';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { Close } from '@mui/icons-material';
import { fontSizes, fontWeights } from 'styles/font';

export const ActionButton = styled(Button)`
  &&& {
    &.MuiButton-root {
      font-size: 16px;
    }
  }
`;

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

export const ModalWrapperWithPadding = styled(ModalWrapper)`
  padding: ${spacing.largePlus};
`;

export const ModalMainIcon = styled.img`
  display: block;
  height: 34px;
  cursor: default;
  margin-bottom: ${spacing.large};
`;

export const ModalIconContainer = styled.div`
  padding: ${spacing.largePlus};
  border-bottom: 1px solid ${palette.coolGrey2};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalDescriptionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.large};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: ${spacing.small} ${spacing.largePlus} ${spacing.largePlus};
`;

export const FlexButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FixedWidthButtonWrapper = styled.div`
  width: ${({ width }) => width || 'auto'}px;
  button {
    font-size: 14px !important;
  }
`;

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiButtonBase-root {
      position: absolute;
      top: 8px;
      right: 8px;
      display: block;
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    &.MuiSvgIcon-root {
      width: 16px;
      height: 16px;
    }
  }
`;

export const ModalHeader = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: ${({ textAlign }) => textAlign ?? 'center'};
`;

export const ModalDescription = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-align: center;
`;

export const ModalHeaderContainerStyled = styled.div`
  width: 100%;
  padding: 5px;
`;

export const ModalFooterStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 10px;
  padding: 0px 25px 15px 25px;
`;

export const TextWaringStyled = styled.p`
  padding-top: 1.5rem;
  color: ${palette.mediumGrey};
  font-size: 16px;
  width: 100%;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const StepsContainer = styled.div`
  display: flex;
  height: 100%;
  width: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  transform: translateX(-${({ stepIndex }) => stepIndex * 384 || 0}px);
  transition: transform 0.3s ease-out;
`;
export const Container = styled.div`
  height: 384px;
  width: 384px;
  overflow: hidden;
`;

export const IncludeContainerStyled = styled.div`
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const InfoHeaderTextStyled = styled.p`
  color: ${palette.coolGrey9};
  font-family: 'Outfit';
  font-weight: 600;
  margin: 0;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: 'Outfit', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.mediumGrey};
`;
