import { Box, FormControlLabel, Grid, Radio } from "@mui/material";
import { CloseIcon, CloseIconButton, FlexButtonWrapper, ModalWrapperWithPadding } from "../styled";
import { CancelButton, ConfirmButton } from "../ModalButton/ModalButtons";
import { EmptyMessage,
   HeaderSearchWrapper,
   ListItem, 
   ListsWrapper, 
   Title, 
   Container, 
   ListItemTextButton, 
   WorkflowFoldersListContainer,
   FolderIconContainer,
   TitleWithButtonWrapper } from "./styled";
import HeaderSearch from "@/app/components/template/HeaderSearch/HeaderSearch";
import { useEffect, useState } from "react";
import { FolderNameContainer } from "@/app/components/task-template/TaskTemplateApplicator/styled";
import { NextArrow } from "../ListPickerModal/styled";
import { getPatientAttachments } from "@/app/api/patient-attachment-api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const PatientAttachmentReferenceModal = ({ attachmentList, closeModal }) => {
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentFolders, setCurrentFolders] = useState([]);
  const [currentAttachments, setCurrentAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTitle, setCurrentTitle] = useState("Reference File From Patient");

  useEffect(() => {
    const initialFolders = attachmentList?.filter(({ type }) => type === 'FOLDER');
    const initialAttachments = attachmentList?.filter(({ type }) => type !== 'FOLDER');
    setCurrentFolders(initialFolders);
    setCurrentAttachments(initialAttachments);
  }, [attachmentList]);

  const handleRadioChange = (event) => {
    setSelectedAttachment(event.target.value);
  };

  const onFolderClick = async (folder) => {
    try {
      setNavigationStack((prevStack) => [
        ...prevStack,
        { folders: currentFolders, attachments: currentAttachments },
      ]);
  
      const data = await getPatientAttachments(folder.patientIdentifier, folder.attachmentIdentifier);
      const subFolders = data?.filter(({ type }) => type === 'FOLDER');
      const subAttachments = data?.filter(({ type }) => type !== 'FOLDER');

      setCurrentFolders(subFolders);
      setCurrentAttachments(subAttachments);
      setCurrentTitle(folder.fileName);
    } catch (error) {
      console.error(error);
    }
  };
  
  const filteredFolders = currentFolders.filter((folder) =>
    folder.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAttachments = currentAttachments.filter((attachment) =>
    attachment.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const onBack = () => {
    if (navigationStack.length > 0) {
      const previousState = navigationStack.pop();
      setCurrentFolders(previousState.folders);
      setCurrentAttachments(previousState.attachments);
      setNavigationStack([...navigationStack]);

      const previousFolder = navigationStack.length > 0 
        ? navigationStack[navigationStack.length - 1].folders[0]?.fileName 
        : "Reference File From Patient";
      setCurrentTitle(previousFolder);
    }
  };
  
  const renderFolder = (folder) => {
    const { fileName } = folder;
    return (
      <ListItem key={folder.attachmentIdentifier}>
        <FolderIconContainer>
        <FolderOpenIcon />
        </FolderIconContainer>
        <ListItemTextButton onClick={() => onFolderClick(folder)} type="button">
          <FolderNameContainer>{fileName}</FolderNameContainer>
        </ListItemTextButton>
        <NextArrow onClick={() => onFolderClick(folder)} />
      </ListItem>
    );
  };

  return (
    <div>
    <ModalWrapperWithPadding>
      <TitleWithButtonWrapper>
          {navigationStack.length > 0 && (
            <button type="button" onClick={onBack}>
              <ArrowBackIcon color="warning" />
            </button>
          )}
          <Title>{currentTitle}</Title>
      </TitleWithButtonWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Box m={1} />
      {/* <Container> */}
        <HeaderSearchWrapper>
          <HeaderSearch
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </HeaderSearchWrapper>
        {/* <Box m={0.3} /> */}
        <ListsWrapper>
          {filteredFolders?.length > 0 && (
              <WorkflowFoldersListContainer>
                {filteredFolders
                  .sort((a, b) => a.fileName.localeCompare(b.fileName))
                  .map((folder) => renderFolder(folder))}
              </WorkflowFoldersListContainer> 
          )}
          {filteredAttachments?.length > 0 ? (
            filteredAttachments.map((attachment, index) => (
              <ListItem key={attachment.attachmentIdentifier || index}>
                <ListItemTextButton
                  type="button"
                  style={{
                    alignItems: 'center',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    
                  }}
                >
                   <FormControlLabel
                    control={
                      <Radio
                        value={attachment.fileName}
                        checked={selectedAttachment === attachment.fileName}
                        onChange={handleRadioChange}
                        size="very small" 
                      />
                    }
                    label={attachment.fileName}
                  />
                </ListItemTextButton>
                
              </ListItem>
            ))
          ) : (
            <EmptyMessage>No attachments found</EmptyMessage>
          )}
        </ListsWrapper>
      {/* </Container> */}
      <Box m={1} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <CancelButton
            style={{ width: '190px' }}
            fullWidth
            variant="secondary"
            size="small"
            onClick={closeModal}
          >
            Cancel
          </CancelButton>
          <Box m={1} />
          <ConfirmButton
            style={{ width: '190px' }}
            fullWidth
            size="small"
            disabled={!selectedAttachment}
          >
            Save
          </ConfirmButton>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
    </div>
  );
};

export default PatientAttachmentReferenceModal;
