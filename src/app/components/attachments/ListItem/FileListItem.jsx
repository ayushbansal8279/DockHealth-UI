import React from 'react';
import moment from 'moment';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import GoogleDriveIcon from 'img/google-drive-icon';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cell, Row } from './styled';

const FileListItem = props => {
  const { file, options, onClick } = props;
  const { fileName, dateCreated, creator, type } = file;

  return (
    <Row onClick={onClick} clickable>
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
      <Cell>{moment(dateCreated).fromNow()}</Cell>
      <Cell onClick={event => event.stopPropagation()}>
        <OptionsMenu customButtonComponent={IconButton} options={options}>
          <MoreVertIcon />
        </OptionsMenu>
      </Cell>
    </Row>
  );
};

export default FileListItem;
