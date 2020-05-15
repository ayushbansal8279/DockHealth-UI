import { Button } from '@material-ui/core';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const DeleteGroupModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  max-width: 100vw;
  padding: ${spacing.largePlus};
  font-family: 'Roboto Condensed', sans-serif;
  background-color: white;
`;

export const FileIcon = styled.img`
  height: 34px;
  cursor: default;
  margin-bottom: ${spacing.large};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${spacing.regularPlus};
`;

export const DeleteButton = styled(Button)`
  width: 126px;
`;
