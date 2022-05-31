import React from 'react';
import styled from 'styled-components';
import { MontserratTypography } from 'styles/theme-montserrat';
import { Cross, Description, Header } from '../GroupNameSection/styled';
import messages from './messages';

const Container = styled.div`
  @media print {
    display: none;
  }
`;

const AddGroupNameButton = () => (
  <Container>
    <MontserratTypography>
      <Cross>+</Cross>
      <Header>{messages.label}</Header>
    </MontserratTypography>
    <Description>
      <MontserratTypography>{messages.description}</MontserratTypography>
    </Description>
  </Container>
);

export default AddGroupNameButton;
