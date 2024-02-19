import React from 'react';
import { OutfitTypography } from 'styles/theme';
import { Container } from './styled';

const AddAttachmentButton = () => {
  return (
    <Container>
      <OutfitTypography condensed variant="h4" color="inherit">
        +
      </OutfitTypography>
    </Container>
  );
};

export default AddAttachmentButton;
