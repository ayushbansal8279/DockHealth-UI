import React from 'react'
import { CloseButtonWord, DownloadIcon, FileDisplayArea, FileName, ImportPopoverWrapper, PopoverHeader, ProgressMessage } from './styled'
import ExcelLogo from 'img/excel-logo.svg';
import { getImportMessage } from '@/app/helpers/file-import-helpers';

export default function FileImportPopover({closePopover, uploadResponse, type}) {

  const message = getImportMessage(type, uploadResponse);

  return (
    <ImportPopoverWrapper>
      <PopoverHeader>
        {type} Upload
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