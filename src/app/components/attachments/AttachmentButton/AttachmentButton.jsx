import React from 'react';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme';

import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { Container, RemoveAttachmentButtonContainer } from './styled';
import { getIconFromContentType } from './helpers';

const AttachmentButton = ({ attachment, onClick, onRemoveClick }) => {
  const { attachmentIdentifier, fileName, contentType } = attachment;
  const IconComponent = getIconFromContentType({ contentType });

  return (
    <Tooltip key={attachmentIdentifier} title={fileName}>
      <Container
        download={fileName}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onClick(attachment);
        }}
      >
        <IconComponent color="inherit" fontSize="small" />
        <Spacing horizontal={2} />
        <OutfitTypography condensed variant="h4" weight="bold" noWrap>
          {fileName}
        </OutfitTypography>
        {typeof onRemoveClick === 'function' && (
          <RemoveAttachmentButtonContainer>
            <IconButton
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRemoveClick(attachmentIdentifier);
              }}
              size="small"
              color="inherit"
            >
              <Close fontSize="small" />
            </IconButton>
          </RemoveAttachmentButtonContainer>
        )}
      </Container>
    </Tooltip>
  );
};

export default AttachmentButton;
