import React from 'react';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
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
  const { file, options } = props;
  const { fileName, contentType, dateCreated } = file;

  const IconComponent = getIconFromContentType(contentType);

  return (
    <Container>
      <IconContainer>
        <IconComponent fontSize="inherit" />
      </IconContainer>
      <DetailsContainer>
        <FileNameText>{trunc(fileName, 50)}</FileNameText>
        <CreatedText>{moment(dateCreated).fromNow()}</CreatedText>

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
