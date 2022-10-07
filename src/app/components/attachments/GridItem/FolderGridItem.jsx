import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { trunc } from 'helpers/utility-functions';
import {
  Container,
  CreatedText,
  DetailsContainer,
  FileNameText,
  OptionsContainer,
} from './styled';

const FolderGridItem = props => {
  const {
    folder,
    options,
    onClick,
    onDragStart,
    onDragEnter,
    onDragEnd,
    draggable = false,
  } = props;
  const { fileName, dateCreated } = folder;

  return (
    <Container
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      draggable={draggable}
    >
      <DetailsContainer>
        <Box mt="-2px" mr={1}>
          <FolderOpenIcon />
        </Box>
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

export default FolderGridItem;
