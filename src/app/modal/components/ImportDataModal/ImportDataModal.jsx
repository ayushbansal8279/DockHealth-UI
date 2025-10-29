import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, CircularProgress } from '@mui/material';
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
  ProcessingArea,
  ProcessingContainer,
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
  importFileTypeHint,
}) => {
  const inputFileReference = useRef(null);
  const [modalStep, setModalStep] = useState(step);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = useCallback(
    (file) => {
      const isPatientImport = label?.toLowerCase().includes('patient');

      if (!isPatientImport) {
        setIsUploading(true);
        setModalStep(3);
        setUploadProgress(0);
      }

      const progressCallback = (progressEvent) => {
        if (progressEvent.total && !isPatientImport) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        }
      };

      const closeModalAfterResponse = () => {
        if (isPatientImport) {
          setTimeout(() => {
            closeModal();
          }, 100);
        } else {
          setIsUploading(false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              closeModal();
            });
          });
        }
      };

      uploadFunction(
        file,
        { onUploadProgress: progressCallback },
        identifier,
        type,
      )
        .then((response) => {
          setImportResponse?.(response);
          if (isPatientImport) {
            setIsUploading(false);
          }
          closeModalAfterResponse();
        })
        .catch((error) => {
          console.error('File upload failed:', error);
          setImportResponse?.(null);
          if (isPatientImport) {
            setIsUploading(false);
          }
          closeModalAfterResponse();
        })
        .finally(() => {
          setImportPopoverOpen?.(true);
        });
    },
    [
      closeModal,
      uploadFunction,
      identifier,
      type,
      setImportPopoverOpen,
      setImportResponse,
      label,
    ],
  );

  const handleClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

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
    [handleFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const isPatientImport = label?.toLowerCase().includes('patient');
  const totalSteps = isPatientImport ? 2 : 3;

  return (
    <ImportDataModalWrapper>
      <CloseIconButton onClick={handleClose} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {modalStep === 1 && (
        <>
          <Description>Step 1 of {totalSteps}</Description>
          <Title>Import {label} list</Title>
          <Spacing vertical={1} />
          <ContentMessage>
            Download our template to ensure your {label} list is properly
            formatted.
          </ContentMessage>
          <ContentMessage style={{ marginBottom: '50px' }}>
            Copy and paste your {label}s into the template, then upload to Dock
            here.
          </ContentMessage>
          <Spacing vertical={5} />
          <Spacing vertical={5} />
          <Box display={'flex'}>
            <CancelButton onClick={handleClose}>Cancel</CancelButton>
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
          <Description>Step 2 of {totalSteps}</Description>
          <Title>Import {label} list</Title>
          <Spacing vertical={1} />
          <ContentMessage style={{ marginBottom: '50px' }}>
            Copy and paste your {label}s into the template, then upload to Dock
            here.
          </ContentMessage>
          <FileInputArea {...getRootProps()}>
            <FileInputImage src={UploadFileIcon} alt="file upload icon" />
            <FileInputMessage>
              {isDragActive ? (
                <span>Drop the files here ...</span>
              ) : (
                <>
                  {importFileTypeHint} or
                  <span style={{ cursor: 'pointer', color: 'blue' }}>
                    {' '}
                    Browse{' '}
                  </span>
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
      {modalStep === 3 && (
        <>
          <Description>Step 3 of 3</Description>
          <Title>Processing your {label} list</Title>
          <Spacing vertical={1} />
          <ContentMessage style={{ marginBottom: '50px' }}>
            Please wait while we process your upload. This may take a few
            moments.
          </ContentMessage>
          <ProcessingArea>
            <ProcessingContainer>
              <CircularProgress size={60} />
              {uploadProgress > 0 && (
                <ContentMessage style={{ marginTop: '20px' }}>
                  {uploadProgress < 100
                    ? `${uploadProgress}% uploaded`
                    : 'Processing...'}
                </ContentMessage>
              )}
            </ProcessingContainer>
          </ProcessingArea>
          {!isUploading && (
            <Box
              display={'flex'}
              justifyContent="center"
              style={{ marginTop: '20px' }}
            >
              <CancelButton onClick={handleClose}>Close</CancelButton>
            </Box>
          )}
        </>
      )}
    </ImportDataModalWrapper>
  );
};

export default ImportDataModal;