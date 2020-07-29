import { Button, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  max-width: 100vw;
  font-family: 'Roboto Condensed', sans-serif;
  background-color: white;
`;

export const ModalWrapperWithPadding = styled(ModalWrapper)`
  padding: ${spacing.largePlus};
`;

export const ModalMainIcon = styled.img`
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
  padding: ${spacing.small} ${spacing.largePlus} ${spacing.largePlus};

  & > button {
    width: 165px; // per design
  }
`;

export const CancelButton = styled(Button)`
  min-width: 170px;
  flex: 1;
`;

export const ConfirmButton = styled(Button)`
  min-width: 170px;
  flex: 1;
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
