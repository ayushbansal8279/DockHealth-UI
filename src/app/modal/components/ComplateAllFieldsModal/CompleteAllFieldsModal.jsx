import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import CircleCompletedGrey from 'img/circle-completed-grey.svg';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  ModalHeaderName,
  ModalDescriptionListContainer,
} from '../styled';
import { CancelButton } from '../ModalButton/ModalButtons';

const CompleteAllFieldsModal = ({ closeModal, incompleteFields }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={CircleCompletedGrey} alt="completed" />
          <ModalHeaderName>A Required Field Is Incomplete</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          You’re about to complete a task which has required fields that are
          incomplete.
        </ModalDescriptionContainer>
        <ModalDescriptionListContainer>
          <ul style={{}}>
            {incompleteFields?.map((field) => {
              return <li>{field?.name}</li>;
            })}
          </ul>
        </ModalDescriptionListContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Ok
          </CancelButton>
          <Spacing horizontal={4} />
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default CompleteAllFieldsModal;
