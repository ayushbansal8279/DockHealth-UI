import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import GoogleDriveIcon from 'img/google-drive-icon';
import { trunc } from 'helpers/utility-functions';
import { getIconFromContentType } from './helpers';
import {
  Container,
  CreatedText,
  DetailsContainer,
  FileNameText,
  IconContainer,
  OptionsContainer,
} from './styled';

const FileGridItem = props => {
  const {
    file,
    options,
    onClick,
    onDragStart,
    onDragEnter,
    onDragEnd,
    draggable = false,
  } = props;
  const { fileName, contentType, dateCreated, type } = file;

  const IconComponent = getIconFromContentType(contentType);

  return (
    <Container
      onClick={onClick}
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
        </Box>
        <OptionsContainer>
          <div onClick={event => event.stopPropagation()}>
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
