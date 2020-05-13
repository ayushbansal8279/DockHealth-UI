import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { Cross, Description, Header } from '../EditGroupSection/styled';
import messages from './messages';

const AddGroupNameButton = () => (
  <>
    <MontserratTypography>
      <Cross>+</Cross>
      <Header>{messages.label}</Header>
    </MontserratTypography>
    <Description>
      <MontserratTypography>{messages.description}</MontserratTypography>
    </Description>
  </>
);

export default AddGroupNameButton;
