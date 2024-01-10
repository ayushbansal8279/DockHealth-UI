import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@mui/material';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import GoogleDriveIcon from 'img/google-drive-icon.png';
import { trunc } from 'helpers/utility-functions';
import {
  ScanStatus,
  ScanStatusText,
} from 'views/patient-details/PatientAttachments/helpers';
import { getIconFromContentType } from './helpers';
import {
  Container,
  CreatedText,
  DetailsContainer,
  FileNameText,
  IconContainer,
  OptionsContainer,
  StatusText,
} from './styled';

const FileGridItem = (props) => {
  const {
    file,
    options,
    onClick,
    onDragStart,
    onDragEnter,
    onDragEnd,
    draggable = false,
  } = props;
  const { fileName, contentType, dateCreated, type, scanStatus } = file;

  const IconComponent = getIconFromContentType(contentType);

  return (
    <Container
      onClick={() => {
        if (scanStatus === ScanStatus.CLEAN || scanStatus === null) {
          onClick();
        }
      }}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      draggable={draggable}
    >
      <IconContainer>
        <IconComponent fontSize="inherit" />
      </IconContainer>
      {type === PatientAttachmentType.FILE_GDRIVE && (
        <Box position="absolute" top="10px" right="10px">
          <img
            src={GoogleDriveIcon}
            alt="Google Drive"
            style={{ width: 16, height: 16 }}
          />
        </Box>
      )}
      <DetailsContainer>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flex={1}
        >
          <FileNameText>{trunc(fileName, 50)}</FileNameText>
          <CreatedText>{moment(dateCreated).fromNow()}</CreatedText>
          <StatusText>{ScanStatusText[scanStatus]}</StatusText>
        </Box>
        <OptionsContainer>
          <div onClick={(event) => event.stopPropagation()}>
            <OptionsMenu customButtonComponent={IconButton} options={options}>
              <MoreVertIcon />
            </OptionsMenu>
          </div>
        </OptionsContainer>
      </DetailsContainer>
    </Container>
  );
};

export default FileGridItem;
