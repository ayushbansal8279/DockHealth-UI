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
  UNSUPPORTED_WARNING_MESSAGE,
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
  AttachmentStatusMessage,
} from './styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '../../common/Tooltip/Tooltip';

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

  const isNotDisabled =
    !scanStatus ||
    scanStatus === ScanStatus.CLEAN ||
    scanStatus === ScanStatus.UNSUPPORTED;

  return (
    <Container
      onClick={() => {
        if (isNotDisabled) {
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
          {fileName?.length > 40 ?
            <Tooltip title={fileName}>
              <FileNameText>{trunc(fileName, 40)}</FileNameText>
            </Tooltip>
            : <FileNameText>{fileName}</FileNameText>
          }
          <CreatedText>{moment(dateCreated).fromNow()}</CreatedText>
          <StatusText>
            {!scanStatus || scanStatus === ScanStatus.IN_PROGRESS ? (
              ScanStatusText.IN_PROGRESS
            ) : scanStatus === ScanStatus.UNSUPPORTED ? (
              <AttachmentStatusMessage>
                {ScanStatusText.UNSUPPORTED}
                <Tooltip title={UNSUPPORTED_WARNING_MESSAGE}>
                  <InfoOutlinedIcon
                    sx={{ color: 'error.main', cursor: 'pointer' }}
                  />
                </Tooltip>
              </AttachmentStatusMessage>
            ) : (
              ScanStatusText[scanStatus]
            )}
          </StatusText>
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
