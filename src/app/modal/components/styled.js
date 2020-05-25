import { Button } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
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
`;

export const ConfirmButton = styled(Button)`
  flex: 1;
`;
