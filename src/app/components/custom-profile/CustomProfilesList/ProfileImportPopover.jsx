import React from 'react'
import { CloseButtonWord, DownloadIcon, FileDisplayArea, FileName, ImportPopoverWrapper, PopoverHeader, ProgressMessage } from './styled'
import ExcelLogo from 'img/excel-logo.svg';

export default function ProfileImportPopover({closePopover, uploadResponse}) {
  const { statusCode } = uploadResponse || {};

  const message =
    statusCode === 'SUCCESS'
      ? 'Profile records are successfully uploaded. Please refresh the page after some time.'
      : 'File upload failed. Please try again.';
  
  return (
    <ImportPopoverWrapper>
      <PopoverHeader>
        Profile Upload
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
          <ProgressMessage>
            {message}
          </ProgressMessage>
        </FileName>
      </FileDisplayArea>
    </ImportPopoverWrapper>
  )
}