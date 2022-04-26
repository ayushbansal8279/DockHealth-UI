import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cell, Row } from './styled';

const FileListItem = props => {
  const { fileOrFolder, options, onClick } = props;
  const { fileName, dateCreated, creator, type } = fileOrFolder;

  return (
    <Row onClick={onClick}>
      <Cell bold>
        {type === PatientAttachmentType.FOLDER && (
          <>
            <FolderOpenIcon />
            <Box mx={1} />
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
