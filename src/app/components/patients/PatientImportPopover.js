import React from 'react';
import styled from 'styled-components';
import {
  CloseIconButton,
  CloseIcon,
  ModalWrapperWithPadding,
} from 'modal/components/styled.js';
import ExcelLogo from 'img/ExcelLogo.svg';

const ImportPatientPopoverWrapper = styled(ModalWrapperWithPadding)`
  position: -webkit-sticky;
  position: sticky;
  width: 401px;
  height: 129px;
  bottom: 0;
  left: 0;
  align-items: baseline;
`;

const DownloadIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const FileName = styled.p`
  text-align: left;
  padding-left: 20px;
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 135%;
`;

const ImportPatientsModal = ({ closeModal }) => {
  return (
    <ImportPatientPopoverWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <FileName>
        <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
        Place Holder File Name
      </FileName>
    </ImportPatientPopoverWrapper>
  );
};
export default ImportPatientsModal;
