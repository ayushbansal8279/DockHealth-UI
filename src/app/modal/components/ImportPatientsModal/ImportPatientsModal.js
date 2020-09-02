import React, { useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import palette from 'styles/palette';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import { uploadPatientData } from 'actions/patient-actions';
import { CloseIconButton, CloseIcon } from '../styled';
import uploadFileIcon from 'img/uploadFileIcon.svg';
import {
  ImportPatientModalWrapper,
  Description,
  ContentMessage,
  Title,
  StyledButton,
  AlreadyHaveTemplate,
  FileInputArea,
  FileInputMessage,
  FileInputImage,
} from './styled';

const ImportPatientsModal = ({
  step,
  closeModal,
  downloadTemplate,
  setImportPopoverOpen,
  refreshPatientList,
}) => {
  const inputFileReference = useRef(null);
  const dispatch = useDispatch();

  const onButtonClick = () => {
    inputFileReference.current.click();
  };

  const [modalStep, setModalStep] = useState(step);

  const onFileInputChange = useCallback(() => {
    const fileInputElement = inputFileReference.current;

    if (fileInputElement) {
      const [uploadedFile] = fileInputElement.files;

      uploadPatientData(uploadedFile, {
        onUploadProgress: ({ loaded, total }) => {
          if (loaded === total) {
            closeModal();
            setImportPopoverOpen(true);
            refreshPatientList();
          }
        },
      })(dispatch)
        .then(() => {
          closeModal();
        })
        .catch(() => {});
    }
  }, [closeModal, dispatch, refreshPatientList, setImportPopoverOpen]);

  return (
    <>
      <ImportPatientModalWrapper>
        <CloseIconButton onClick={closeModal} size="small" color="secondary">
          <CloseIcon />
        </CloseIconButton>
        {modalStep === 1 && (
          <>
            <Description>Step 1 of 2</Description>
            <Title>Import Patient list</Title>
            <Spacing vertical={1} />
            <ContentMessage>
              To ensure your patient list gets uploaded properly, please
              download our easy template.
            </ContentMessage>
            <ContentMessage style={{ marginBottom: '50px' }}>
              Copy and paste your patient lists into the template, then upload
              to Dock here.
            </ContentMessage>
            <Spacing vertical={5} />
            <Spacing vertical={5} />
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6}>
                <StyledButton
                  variant="outlined"
                  type="button"
                  size="small"
                  onClick={closeModal}
                >
                  Cancel
                </StyledButton>
              </Grid>
              <Grid item xs={6}>
                <StyledButton
                  variant="contained"
                  size="small"
                  onClick={() => {
                    downloadTemplate();
                    setModalStep(2);
                  }}
                >
                  Download Template
                </StyledButton>
              </Grid>
            </Grid>
            <Spacing vertical={5} />
            <AlreadyHaveTemplate
              style={{ color: palette.cyanBlue, textAlign: 'center' }}
              onClick={() => {
                setModalStep(2);
              }}
            >
              I already have this template
            </AlreadyHaveTemplate>
          </>
        )}
        {modalStep === 2 && (
          <>
            <Description>Step 2 of 2</Description>
            <Title>Import Patient list</Title>
            <Spacing vertical={1} />
            <ContentMessage style={{ marginBottom: '50px' }}>
              Copy and paste your patients into the template, then upload To
              Dock here.
            </ContentMessage>
            <FileInputArea>
              <FileInputImage src={uploadFileIcon} alt="file upload icon" />
              <FileInputMessage>
                Drag and drop your CSV or Excel template here or
                <input
                  type="file"
                  id="file"
                  ref={inputFileReference}
                  style={{ display: 'none' }}
                  onChange={onFileInputChange}
                />
                <button
                  onClick={onButtonClick}
                  style={{ color: palette.cyanBlue, paddingRight: '5px' }}
                >
                  {' '}
                  <span> Browse </span>{' '}
                </button>
                your local files.
              </FileInputMessage>
            </FileInputArea>
          </>
        )}
      </ImportPatientModalWrapper>
    </>
  );
};
export default ImportPatientsModal;
