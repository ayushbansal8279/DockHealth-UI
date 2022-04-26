import React from 'react';
import moment from 'moment';
import { Box, IconButton } from '@material-ui/core';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { trunc } from 'helpers/utility-functions';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
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
  const { fileOrFolder, options } = props;
  const { fileName, contentType, dateCreated, type } = fileOrFolder;

  const IconComponent = getIconFromContentType(contentType);

  return (
    <Container>
      {IconComponent && (
        <IconContainer>
          <IconComponent fontSize="inherit" />
        </IconContainer>
      )}
      <DetailsContainer>
        {type === PatientAttachmentType.FOLDER && (
          <Box mt="-2px" mr={1}>
            <FolderOpenIcon />
          </Box>
        )}
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
