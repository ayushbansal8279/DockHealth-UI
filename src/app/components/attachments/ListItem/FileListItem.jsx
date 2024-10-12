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
} from 'views/patient-details/PatientAttachments/helpers';
import { Cell, Row } from './styled';

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
  const { fileName, dateCreated, creator, type, scanStatus } = file;

  const fileScanStatus =
    !scanStatus || scanStatus === 'IN_PROGRESS'
      ? 'IN_PROGRESS'
      : scanStatus;

  return (
    <Row
      onClick={() => {
        if (fileScanStatus) {
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
      <Cell>{ScanStatusText[fileScanStatus]}</Cell>
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
