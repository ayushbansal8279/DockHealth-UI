import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@mui/material';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Cell, Row } from './styled';

const FolderListItem = (props) => {
  const {
    folder,
    options,
    onClick,
    onDragStart,
    onDragEnter,
    onDragEnd,
    draggable = false,
    style,
  } = props;
  const { fileName, dateCreated, creator } = folder;

  return (
    <Row
      onClick={onClick}
      clickable
      style={style}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      draggable={draggable}
    >
      <Cell bold>
        <FolderOpenIcon />
        <Box mx={1} />
        {fileName}
      </Cell>
      <Cell>{creator?.name || ''}</Cell>
      <Cell>{moment(dateCreated).fromNow()}</Cell>
      <Cell onClick={(event) => event.stopPropagation()}>
        <div onClick={(event) => event.stopPropagation()}>
          <OptionsMenu customButtonComponent={IconButton} options={options}>
            <MoreVertIcon />
          </OptionsMenu>
        </div>
      </Cell>
    </Row>
  );
};

export default FolderListItem;
