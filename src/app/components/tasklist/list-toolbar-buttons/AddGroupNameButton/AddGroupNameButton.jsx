import React from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { ButtonContainer, ButtonWrapper } from '../styled';

export const AddGroupButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Outfit', sans-serif;
      color: ${palette.white};
      // font-weight: ${fontWeights.light};
      display: inline-block;
      margin-left: ${spacing.tiny};
      margin-right: ${spacing.tiny};
      text-transform: none;
      font-family: Outfit;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
    }
  }
`;

const AddGroupNameButton = React.forwardRef(({ active, onClick }) => (
  <ButtonContainer>
    <ButtonWrapper
      variant="text"
      size="large"
      onClick={onClick}
      active={active}
    >
      <AddIcon />
      <AddGroupButtonLabel variant="body1" component="span">
        Group
      </AddGroupButtonLabel>
    </ButtonWrapper>
  </ButtonContainer>
));

export default AddGroupNameButton;
