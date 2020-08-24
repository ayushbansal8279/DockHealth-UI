import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import ExcelLogo from 'img/ExcelLogo.svg';
import { Add as AddIcon } from '@material-ui/icons';
import circleCompleted from 'img/circle-completed.svg';
import {
  ImportPatientPopoverWrapper,
  ImportPatientPopoverWrapperMinimized,
  PopoverCloseButton,
  CloseButtonWord,
  PopoverMinimizeButton,
  DownloadIcon,
  FileDisplayArea,
  FileName,
  PopoverHeader,
  ProgressDisplayArea,
  ProgressMessage,
  PopoverExpandButton,
  SuccessIcon,
  ErrorDisplayArea,
  ErrorAmount,
  ErrorMessage,
  FixErrorContainer,
  FixErrors,
} from './PatientImportPopover.styled';

const fileProgress = 25;
const inverseProgress = 100 - fileProgress;

const ProgressBar = styled.div`
  width: 283px;
  height: 4px;
  background: linear-gradient(
    to right,
    ${palette.brightBlue} 0% ${fileProgress}%,
    ${palette.coolGrey2} ${fileProgress}% ${inverseProgress}%
  );
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
  align: left;
`;

const ImportPatientsModal = ({ closePopover, expandPopover }) => {
  const x = 1;

  // DEFAULT POPOVER
  if (x === 1) {
    return (
      <ImportPatientPopoverWrapper>
        <PopoverHeader>
          Patient Upload
          <PopoverCloseButton
            onClick={closePopover}
            size="small"
            color="secondary"
          >
            <PopoverMinimizeButton />
          </PopoverCloseButton>
        </PopoverHeader>

        <FileDisplayArea>
          <FileName>
            <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
            Place Holder File Name
          </FileName>
        </FileDisplayArea>

        <ProgressDisplayArea>
          <ProgressBar />
          <ProgressMessage>{fileProgress}% Complete</ProgressMessage>
        </ProgressDisplayArea>
      </ImportPatientPopoverWrapper>
    );
  }

  // MINIMIZED POPOVER
  if (x === 2) {
    return (
      <ImportPatientPopoverWrapperMinimized>
        <PopoverHeader>
          Patient Upload
          <PopoverExpandButton
            onClick={expandPopover}
            size="small"
            color="secondary"
          >
            <AddIcon />
          </PopoverExpandButton>
        </PopoverHeader>
      </ImportPatientPopoverWrapperMinimized>
    );
  }
  // COMPLETED UPLOAD POPOVER
  if (x === 3) {
    return (
      <ImportPatientPopoverWrapper>
        <PopoverHeader>
          Patient Upload
          <CloseButtonWord
            onClick={closePopover}
            size="small"
            color="secondary"
          >
            Close
          </CloseButtonWord>
        </PopoverHeader>

        <FileDisplayArea>
          <FileName>
            <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
            Place Holder File Name
            <SuccessIcon src={circleCompleted} alt="CheckCircle" />
          </FileName>
        </FileDisplayArea>
      </ImportPatientPopoverWrapper>
    );
  }
  // ERROR POPOVER
  if (x === 4) {
    return (
      <ImportPatientPopoverWrapper>
        <PopoverHeader>
          Patient Upload
          <CloseButtonWord
            onClick={closePopover}
            size="small"
            color="secondary"
          >
            Close
          </CloseButtonWord>
          <PopoverCloseButton
            onClick={closePopover}
            size="small"
            color="secondary"
          >
            <PopoverMinimizeButton />
          </PopoverCloseButton>
        </PopoverHeader>

        <FileDisplayArea>
          <FileName>
            <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
            Place Holder File Name
            <SuccessIcon src={circleCompleted} alt="CheckCircle" />
          </FileName>
        </FileDisplayArea>

        <ErrorDisplayArea>
          <ErrorAmount> 2 Errors </ErrorAmount>
          <ErrorMessage>Row 20 - Length of data too long</ErrorMessage>
          <ErrorMessage>Row 21 - Length of data too long</ErrorMessage>

          <FixErrorContainer>
            <FixErrors>Re-upload corrected file</FixErrors>
            <FixErrors>Add patients manually</FixErrors>
          </FixErrorContainer>
        </ErrorDisplayArea>
      </ImportPatientPopoverWrapper>
    );
  }
};
export default ImportPatientsModal;
