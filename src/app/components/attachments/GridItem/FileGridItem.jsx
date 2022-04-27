import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
  const { file, options, onClick } = props;
  const { fileName, contentType, dateCreated } = file;

  const IconComponent = getIconFromContentType(contentType);

  return (
    <Container onClick={onClick}>
      <IconContainer>
        <IconComponent fontSize="inherit" />
      </IconContainer>
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
          <OptionsMenu customButtonComponent={IconButton} options={options}>
            <MoreVertIcon />
          </OptionsMenu>
        </OptionsContainer>
      </DetailsContainer>
    </Container>
  );
};

export default FileGridItem;
