import { Button, IconButton } from '@mui/material';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { Close } from '@mui/icons-material';
import { fontSizes, fontWeights } from 'styles/font';


export const ModalDescriptionContainer = styled.div`
  padding: ${spacing.large};
  align-self: stretch;
  color: ${palette.black};
  text-align: center;
  font-family: Outfit;
  font-size: 18px;
  font-style: normal;
  font-weight: 300;
  line-height: 25px;
`;

export const ModalIconContainer = styled.div`
  padding-top: ${spacing.largePlus};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
