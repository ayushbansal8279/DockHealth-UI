import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';
import Spacing from 'components/common/Spacing';
import UploadFileIcon from 'img/upload-file.svg';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  ImportDataModalWrapper,
  Description,
  ContentMessage,
  Title,
  AlreadyHaveTemplate,
  FileInputArea,
  FileInputMessage,
  FileInputImage,
} from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const ImportDataModal = ({
  step = 1,
  closeModal,
  downloadTemplate,
  setImportPopoverOpen,
  refreshPatientListOnUpload,
  uploadFunction,
  label,
  identifier,
  setImportResponse,
  type,
  importFileTypeHint
}) => {
  const inputFileReference = useRef(null);
  const [modalStep, setModalStep] = useState(step);

  const handleFileUpload = useCallback(
    (file) => {
      uploadFunction(
        file,
        { onUploadProgress: closeModal },
        identifier,
        type
      )
        .then((response) => {
          setImportResponse?.(response);
        })
        .catch((error) => {
          console.error("File upload failed:", error);
          setImportResponse?.(null);
        })
        .finally(() => {
          setImportPopoverOpen?.(true);
        });
    },
    [closeModal, uploadFunction, identifier, setImportPopoverOpen]
  );
  
  const onFileInputChange = useCallback(() => {
    const fileInputElement = inputFileReference.current;
    if (fileInputElement) {
      const [uploadedFile] = fileInputElement.files;
      if (uploadedFile) {
        handleFileUpload(uploadedFile);
      }
    }
  }, [handleFileUpload]);
  
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach(handleFileUpload);
    },
    [handleFileUpload]
  );
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <ImportDataModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {modalStep === 1 && (
        <>
          <Description>Step 1 of 2</Description>
          <Title>Import {label} list</Title>
          <Spacing vertical={1} />
          <ContentMessage>
            Download our template to ensure your {label} list is properly formatted.
          </ContentMessage>
          <ContentMessage style={{ marginBottom: '50px' }}>
              Copy and paste your {label}s into the template,
              then upload to Dock here.
          </ContentMessage>
          <Spacing vertical={5} />
          <Spacing vertical={5} />
          <Box display={'flex'}>
            <CancelButton onClick={closeModal}>Cancel</CancelButton>
            <Spacing horizontal={4} />
            <ConfirmButton
              onClick={() => {
                downloadTemplate();
                setModalStep(2);
              }}
            >
              Download Template
            </ConfirmButton>
          </Box>
          <Spacing vertical={5} />
          <AlreadyHaveTemplate onClick={() => setModalStep(2)}>
            I already have this template
          </AlreadyHaveTemplate>
        </>
      )}
      {modalStep === 2 && (
        <>
          <Description>Step 2 of 2</Description>
          <Title>Import {label} list</Title>
          <Spacing vertical={1} />
          <ContentMessage style={{ marginBottom: '50px' }}>
            Copy and paste your {label}s into the template, then
            upload to Dock here.
          </ContentMessage>
          <FileInputArea {...getRootProps()}>
            <FileInputImage src={UploadFileIcon} alt="file upload icon" />
            <FileInputMessage>
              {isDragActive ? (
                <span>Drop the files here ...</span>
              ) : (
                <>
                  {importFileTypeHint} or
                  <span style={{ cursor: 'pointer', color: 'blue' }}> Browse </span>
                  your local files.
                </>
              )}
            </FileInputMessage>
            <input
              type="file"
              ref={inputFileReference}
              style={{ display: 'none' }}
              onChange={onFileInputChange}
              {...getInputProps()}
            />
          </FileInputArea>
        </>
      )}
    </ImportDataModalWrapper>
  );
};

export default ImportDataModal;