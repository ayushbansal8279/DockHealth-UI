import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { fontSizes, fontWeights } from 'styles/font';

export const ActionButton = withStyles(() => ({
  root: {
    fontSize: '16px',
  },
}));

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ width }) => width || '450px'};
  max-width: 100vw;
  font-family: 'Roboto Condensed', sans-serif;
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
  padding: ${spacing.largePlus};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: ${spacing.small} ${spacing.largePlus} ${spacing.largePlus};
`;

export const FlexButtonWrapper = styled.div`
  flex: 1;
  button {
    font-size: 14px !important;
  }
`;

export const FixedWidthButtonWrapper = styled.div`
  width: ${({ width }) => width || 'auto'}px;
  button {
    font-size: 14px !important;
  }
`;

export const CloseIconButton = withStyles({
  root: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'block',
  },
})(IconButton);

export const CloseIcon = withStyles({
  root: {
    width: 16,
    height: 16,
  },
})(Close);

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
  color: #ff0000;
  font-size: 16px;
  width: 100%;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
