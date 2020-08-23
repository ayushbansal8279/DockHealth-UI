import React, { useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import palette from 'styles/palette';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import uploadFileIcon from 'img/uploadFileIcon.svg';
import { uploadPatientData } from 'actions/patient-actions';
import { ModalWrapperWithPadding, CloseIconButton, CloseIcon } from '../styled';

const ImportPatientModalWrapper = styled(ModalWrapperWithPadding)`
  display: flex;
  flex-direction: column;
  width: 419px;
  height: 376px;
`;

const Description = styled.p`
  font-size: 12px;
  color: ${palette.darkGrey};
  text-align: center;
  margin-bottom: 0.25rem;
  margin-top.25rem;
`;

const ContentMessage = styled.p`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 25px;
`;

const Title = styled.h5`
  font-family: Roboto Condensed;
  font-size: 18px;
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 25px;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 40px;
  width: 265px;
  height: 50px;
`;
const AlreadyHaveTemplate = styled.a`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  margin-top: 20px;
`;

const FileInputArea = styled.div`
  background-color: ${palette.blueGrey};
  width: 348px;
  height: 142px;
  text-align: center;
`;

const FileInputMessage = styled.div`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  padding-bottom: 0.15rem;
`;

const FileInputImage = styled.img`
  width: 31.97px;
  height: 41px;
  position: center;
  margin: 20px;
`;

const ImportPatientsModal = ({ step, closeModal, downloadTemplate }) => {
  const inputFile = useRef(null);
  const dispatch = useDispatch();

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const [modalStep, setModalStep] = useState(step);

  const onFileInputChange = useCallback(() => {
    const fileInputElement = inputFile.current;

    if (fileInputElement) {
      const [uploadedFile] = fileInputElement.files;

      uploadPatientData(uploadedFile, {
        onUploadProgress: ({ loaded, total }) => {
          // console.log(total);
          if (loaded === total) {
            closeModal();
          }
        },
      })(dispatch)
        .then(() => {
          closeModal();
        })
        .catch(() => {});
    }
  }, [closeModal, dispatch]);

  return (
    <>
      {modalStep === 1 && (
        <ImportPatientModalWrapper>
          <CloseIconButton onClick={closeModal} size="small" color="secondary">
            <CloseIcon />
          </CloseIconButton>
          <Description>Step 1 of 2</Description>
          <Title>Import Patient list</Title>
          <Spacing vertical={1} />
          <ContentMessage>
            To ensure your patient list gets uploaded properly, please download
            our easy template.
          </ContentMessage>
          <ContentMessage style={{ marginBottom: '50px' }}>
            Copy and paste your patient lists into the template, then upload to
            Dock here.
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
        </ImportPatientModalWrapper>
      )}
      {modalStep === 2 && (
        <ImportPatientModalWrapper>
          <CloseIconButton onClick={closeModal} size="small" color="secondary">
            <CloseIcon />
          </CloseIconButton>
          <Description>Step 2 of 2</Description>
          <Title>Import Patient list</Title>
          <Spacing vertical={1} />
          <ContentMessage style={{ marginBottom: '50px' }}>
            Copy and paste your patients into the template, then upload To Dock
            here.
          </ContentMessage>
          <FileInputArea>
            <FileInputImage src={uploadFileIcon} alt="file upload icon" />
            <FileInputMessage>
              Drag and drop your CSV or Excel template here or
              <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: 'none' }}
                onChange={onFileInputChange}
              />
              <a onClick={onButtonClick} style={{ color: palette.cyanBlue }}>
                {' '}
                <span> Browse </span>{' '}
              </a>
              your local files.
            </FileInputMessage>
          </FileInputArea>
        </ImportPatientModalWrapper>
      )}
    </>
  );
};
export default ImportPatientsModal;
