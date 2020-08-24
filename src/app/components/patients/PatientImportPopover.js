import React, { useState } from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import ExcelLogo from 'img/ExcelLogo.svg';
import { Add as AddIcon } from '@material-ui/icons';
import circleCompleted from 'img/circle-completed.svg';
import { useDispatch } from 'react-redux';
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

const PatientImportPopover = ({ minimized,  closePopover }) => {
    const [minimizedState, setMinimizedState] = useState(minimized);

  // DEFAULT POPOVER
    return (
        <> 
    {minimizedState === 1 && (
      <ImportPatientPopoverWrapper>
        <PopoverHeader>
          Patient Upload
          <PopoverCloseButton
            onClick={() => {setMinimizedState(2);}}
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
    )}


  {minimizedState === 2 && (
      <ImportPatientPopoverWrapperMinimized>
        <PopoverHeader>
          Patient Upload
          <PopoverExpandButton
            onClick={() => {
                setMinimizedState(1);
            }}
            size="small"
            color="secondary"
          >
            <AddIcon />
          </PopoverExpandButton>
        </PopoverHeader>
      </ImportPatientPopoverWrapperMinimized>
   )}

  {minimizedState === 3  && (
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
    
  )}
  
  {minimizedState === 4 && (
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
            onClick={() => {setMinimizedState(2)}}
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
            <FixErrors onClick={closePopover}>Re-upload corrected file</FixErrors>
            <FixErrors onClick={closePopover}>Add patients manually</FixErrors>
          </FixErrorContainer>
        </ErrorDisplayArea>
      </ImportPatientPopoverWrapper>)}
    </>
    );
};

export default PatientImportPopover;
