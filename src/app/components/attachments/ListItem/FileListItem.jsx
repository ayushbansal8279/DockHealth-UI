import React from 'react';
import moment from 'moment';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import GoogleDriveIcon from 'img/google-drive-icon.png';
import { Box, IconButton } from '@mui/material';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ScanStatus,
  ScanStatusText,
  UNSUPPORTED_WARNING_MESSAGE,
} from 'views/patient-details/PatientAttachments/helpers';
import { Cell, Row } from './styled';
import Tooltip from '../../common/Tooltip/Tooltip';
import { AttachmentStatusMessage } from '../GridItem/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FileListItem = (props) => {
  const {
    file,
    options,
    onClick,
    onDragStart,
    onDragEnter,
    onDragEnd,
    draggable = false,
  } = props;
  const { fileName, dateCreated, creator, type } = file;
  const scanStatus = 'UNSUPPORTED';

  const fileScanStatus =
    !scanStatus || scanStatus === 'IN_PROGRESS' ? 'IN_PROGRESS' : scanStatus;

  const isNotDisabled =
    !scanStatus ||
    scanStatus === ScanStatus.CLEAN ||
    scanStatus === ScanStatus.UNSUPPORTED;

  return (
    <Row
      onClick={() => {
        if (isNotDisabled) {
          onClick();
        }
      }}
      clickable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      draggable={draggable}
    >
      <Cell bold>
        {type === PatientAttachmentType.FILE_GDRIVE && (
          <>
            <img
              src={GoogleDriveIcon}
              alt="Google Drive"
              style={{ width: 16, height: 16 }}
            />
            <Box mx={0.5} />
          </>
        )}
        {fileName}
      </Cell>
      <Cell>{creator?.name || ''}</Cell>
      <Cell>
        {!scanStatus || scanStatus === ScanStatus.IN_PROGRESS ? (
          ScanStatusText.IN_PROGRESS
        ) : scanStatus === ScanStatus.UNSUPPORTED ? (
          <AttachmentStatusMessage>
            {ScanStatusText.UNSUPPORTED}
            <Tooltip title={UNSUPPORTED_WARNING_MESSAGE} placement={'left'}>
              <InfoOutlinedIcon
                sx={{ color: 'error.main', cursor: 'pointer' }}
              />
            </Tooltip>
          </AttachmentStatusMessage>
        ) : (
          ScanStatusText[scanStatus]
        )}
      </Cell>
      <Cell>{moment(dateCreated).fromNow()}</Cell>
      <Cell onClick={(event) => event.stopPropagation()}>
        <OptionsMenu customButtonComponent={IconButton} options={options}>
          <MoreVertIcon />
        </OptionsMenu>
      </Cell>
    </Row>
  );
};

export default FileListItem;
