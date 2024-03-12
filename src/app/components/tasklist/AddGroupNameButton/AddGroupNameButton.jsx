import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import { MontserratTypography } from 'styles/theme-montserrat';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { Cross, Description, Header } from '../GroupNameSection/styled';
import messages from './messages';

const AddGroupButtonContainer = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 4px;
  height: 32px;
  // overflow: hidden;
  @media print {
    display: none;
  }
`;

// const AddGroupNameButton = () => (
//   <Container>
//     <MontserratTypography>
//       <Cross>+</Cross>
//       <Header>{messages.label}</Header>
//     </MontserratTypography>
//     <Description>
//       <MontserratTypography>{messages.description}</MontserratTypography>
//     </Description>
//   </Container>
// );

const AddGroupButtonWrapper = styled(Button)`
  && {
    // border-radius: 5px;
    background-color: ${(props) =>
      props.active ? palette.newBrightBlue : palette.newDarkBlue};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.cornFlowerBlue : palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;

export const AddGroupButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      font-family: 'Outfit', sans-serif;
      color: ${palette.white};
      font-weight: ${fontWeights.light};
      display: inline-block;
      margin-left: ${spacing.tiny};
      margin-right: ${spacing.tiny};
      text-transform: none;
    }
  }
`;

const AddGroupNameButton = React.forwardRef(({ active, onClick }) => (
  <AddGroupButtonContainer>
    <AddGroupButtonWrapper
      variant="text"
      size="large"
      onClick={onClick}
      active={active}
    >
      <AddIcon />
      <AddGroupButtonLabel variant="body1" component="span">
        Group
      </AddGroupButtonLabel>
    </AddGroupButtonWrapper>
  </AddGroupButtonContainer>
));

export default AddGroupNameButton;
