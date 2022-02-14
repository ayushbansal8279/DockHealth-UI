import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { Cross, Description, Header } from '../GroupNameSection/styled';
import messages from './messages';

const AddGroupNameButton = () => (
  <div>
    <MontserratTypography>
      <Cross>+</Cross>
      <Header>{messages.label}</Header>
    </MontserratTypography>
    <Description>
      <MontserratTypography>{messages.description}</MontserratTypography>
    </Description>
  </div>
);

export default AddGroupNameButton;
