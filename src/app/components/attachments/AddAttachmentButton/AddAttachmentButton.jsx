import React from 'react';
import { RobotoTypography } from 'styles/theme';
import { Container } from './styled';

const AddAttachmentButton = () => {
  return (
    <Container>
      <RobotoTypography condensed variant="h4" color="inherit">
        +
      </RobotoTypography>
    </Container>
  );
};

export default AddAttachmentButton;
