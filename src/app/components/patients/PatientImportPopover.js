import React, { useState } from 'react';
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

const ProgressBar = styled.div`
  width: 283px;
  height: 4px;
  background: linear-gradient(
    to right,
    ${palette.brightBlue} 0% ${props => props.fileProgress}%,
    ${palette.coolGrey2} ${props => props.fileProgress}%
      ${props => props.inverseProgress}%
  );
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
  align: left;
`;

const PatientImportPopover = ({ closePopover, patientImportDetails }) => {
  const [minimizedState, setMinimizedState] = useState(false);

  const fileProgress = patientImportDetails
    ? patientImportDetails.completePercentage
    : 0;
  const inverseProgress = 100 - fileProgress;

  // DEFAULT POPOVER
  return (
    <>
      {minimizedState === false && (
        <ImportPatientPopoverWrapper>
          <PopoverHeader>
            Patient Upload
            {(fileProgress < 100 ||
              patientImportDetails?.trackingDetails?.length > 0) && (
              <PopoverCloseButton
                onClick={() => {
                  setMinimizedState(true);
                }}
                size="small"
                color="secondary"
              >
                <PopoverMinimizeButton />
              </PopoverCloseButton>
            )}
            {fileProgress === 100 && (
              <CloseButtonWord
                onClick={closePopover}
                size="small"
                color="secondary"
              >
                Close
              </CloseButtonWord>
            )}
          </PopoverHeader>

          <FileDisplayArea>
            <FileName>
              <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
              {patientImportDetails?.fileName}
              {fileProgress === 100 && (
                <SuccessIcon src={circleCompleted} alt="CheckCircle" />
              )}
            </FileName>
          </FileDisplayArea>
          {fileProgress < 100 && (
            <ProgressDisplayArea>
              <ProgressBar
                fileProgress={fileProgress}
                inverseProgress={inverseProgress}
              />
              <ProgressMessage>{fileProgress}% Complete</ProgressMessage>
            </ProgressDisplayArea>
          )}

          {patientImportDetails?.trackingDetails?.length > 0 && (
            <ErrorDisplayArea>
              <ErrorAmount>
                {' '}
                {patientImportDetails?.trackingDetails?.length} Errors{' '}
              </ErrorAmount>
              {patientImportDetails?.trackingDetails?.map(
                ({ reference, errorDetails }) => (
                  <ErrorMessage>
                    {reference} - {errorDetails}
                  </ErrorMessage>
                ),
              )}

              <FixErrorContainer>
                <FixErrors onClick={closePopover}>
                  Re-upload corrected file
                </FixErrors>
                <FixErrors onClick={closePopover}>
                  Add patients manually
                </FixErrors>
              </FixErrorContainer>
            </ErrorDisplayArea>
          )}
        </ImportPatientPopoverWrapper>
      )}

      {minimizedState === true && (
        <ImportPatientPopoverWrapperMinimized>
          <PopoverHeader>
            Patient Upload
            <PopoverExpandButton
              onClick={() => {
                setMinimizedState(false);
              }}
              size="small"
              color="secondary"
            >
              <AddIcon />
            </PopoverExpandButton>
          </PopoverHeader>
        </ImportPatientPopoverWrapperMinimized>
      )}
    </>
  );
};

export default PatientImportPopover;
