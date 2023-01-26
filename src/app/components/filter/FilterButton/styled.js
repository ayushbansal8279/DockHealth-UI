import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const FilterButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.active ? palette.blueOcean : 'transparent'};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.blueOcean : 'transparent'};
    }
  }
`;

export const FilterButtonLabel = styled(Typography)`
  &&& {
    .MuiTypography-root {
      font-family: 'Montserrat', sans-serif;
      color: ${(props) => (props.active ? palette.white : palette.coolGrey1)};
      font-weight: ${(props) =>
        props.active ? fontWeights.bold : fontWeights.regular};
      display: inline-block;
      margin-right: ${spacing.tiny};
    }
  }
`;

export const FilterClearButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${palette.darkBlue};
    :hover {
      background-color: ${palette.darkBlue};
    }
  }
`;

export const FilterClearButtonLabel = styled(Typography)`
  &&& {
    .MuiTypography-root {
      font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: inline-block;
      margin-right: ${spacing.tiny};
    }
  }
`;
