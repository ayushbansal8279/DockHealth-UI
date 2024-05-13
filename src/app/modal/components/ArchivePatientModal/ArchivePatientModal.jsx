import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import RedFolder from 'img/modals/red-folder.svg';
import { userProfileSelector } from 'selectors/user-selectors';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const ArchivePatientModal = ({ closeModal, confirm }) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={RedFolder} alt="red-folder" />
          <ModalHeaderName>
            Archive {customerTypeLabelCapitalized}
          </ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          Are you sure you want to archive this {customerTypeLabel}?
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Do Not Archive
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
            Archive
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchivePatientModal;
