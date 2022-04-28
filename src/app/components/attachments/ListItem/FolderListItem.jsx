import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cell, Row } from './styled';

const FolderListItem = props => {
  const { folder, options, onClick } = props;
  const { fileName, dateCreated, creator } = folder;

  return (
    <Row onClick={onClick} clickable>
      <Cell bold>
        <FolderOpenIcon />
        <Box mx={1} />
        {fileName}
      </Cell>
      <Cell>{creator?.name || ''}</Cell>
      <Cell>{moment(dateCreated).fromNow()}</Cell>
      <Cell onClick={event => event.stopPropagation()}>
        <div onClick={event => event.stopPropagation()}>
          <OptionsMenu customButtonComponent={IconButton} options={options}>
            <MoreVertIcon />
          </OptionsMenu>
        </div>
      </Cell>
    </Row>
  );
};

export default FolderListItem;
