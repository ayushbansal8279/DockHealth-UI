import React from 'react';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cell, Row } from './styled';

const FileListItem = props => {
  const { file, options, onClick } = props;
  const { fileName, dateCreated, creator } = file;

  return (
    <Row onClick={onClick} clickable>
      <Cell bold>{fileName}</Cell>
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
