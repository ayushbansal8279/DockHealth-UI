import { Button, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 480px;
  max-width: 100vw;
  padding: ${spacing.largePlus};
  font-family: 'Roboto Condensed', sans-serif;
  background-color: white;
`;

export const ModalMainIcon = styled.img`
  cursor: default;
  margin-bottom: ${spacing.large};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${spacing.small};

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
