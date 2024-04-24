import styled from 'styled-components';
import { Box, Button } from '@mui/material';
import palette from 'styles/palette';

export const ButtonContainer = styled(Box)`
  display: flex;
  width: fit-content;
  border-radius: 4px;
  height: 32px;
  color: white;
  @media print {
    display: none;
  }
`;

export const ButtonWrapper = styled(Button)<{ active: boolean }>`
  && {
    background-color: ${(props) =>
      props.active ? palette.newBrightBlue : palette.newDarkBlue};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.cornFlowerBlue : palette.purpleNavy};
    }
    padding-left: 12px;
    padding-right: 12px;
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;
