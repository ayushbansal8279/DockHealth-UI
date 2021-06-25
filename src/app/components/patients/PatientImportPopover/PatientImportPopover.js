import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelLogo from 'img/excel-logo.svg';
import { Add as AddIcon } from '@material-ui/icons';
import circleCompleted from 'img/circle-completed.svg';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
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
  ProgressBar,
} from './styled';

const PatientImportPopover = ({
  closePopover,
  patientImportDetails,
  hasImportFailed,
}) => {
  const [minimizedState, setMinimizedState] = useState(false);

  const fileProgress = patientImportDetails
    ? patientImportDetails.completePercentage
    : 0;
  const inverseProgress = 100 - fileProgress;

  const uploadedFileNameMaxLength = 30;
  const uploadedFileName =
    patientImportDetails?.fileName?.length > uploadedFileNameMaxLength
      ? patientImportDetails?.fileName
          ?.substring(0, uploadedFileNameMaxLength)
          .trim()
          .concat('...')
      : patientImportDetails?.fileName;

  const importErrorMessage = patientImportDetails?.errorDetails
    ? patientImportDetails?.errorDetails
    : `${patientImportDetails?.trackingDetails?.length} Errors`;

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  // DEFAULT POPOVER
  return (
    <>
      {!minimizedState && (
        <ImportPatientPopoverWrapper>
          <PopoverHeader>
            {customerTypeLabelCapitalized} Upload
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
            {(fileProgress === 100 || hasImportFailed) && (
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
              {uploadedFileName}
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

          {(patientImportDetails?.trackingDetails?.length > 0 ||
            patientImportDetails?.inError ||
            hasImportFailed) && (
            <ErrorDisplayArea>
              <ErrorAmount>
                {' '}
                {hasImportFailed
                  ? 'Error processing import'
                  : `${importErrorMessage}`}
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
                  Add {customerTypeLabel}s manually
                </FixErrors>
              </FixErrorContainer>
            </ErrorDisplayArea>
          )}
        </ImportPatientPopoverWrapper>
      )}

      {minimizedState && (
        <ImportPatientPopoverWrapperMinimized>
          <PopoverHeader>
            {customerTypeLabelCapitalized} Upload
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
