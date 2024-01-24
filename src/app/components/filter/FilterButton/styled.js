import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const FilterButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.active ? palette.newBrightBlue : palette.newDarkBlue};
    border-right: 2px solid ${palette.white};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.cornFlowerBlue : palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;

export const FilterButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      font-family: 'Outfit', sans-serif;
      color: ${palette.white};
      font-weight: ${fontWeights.light};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
    }
  }
`;

export const FilterClearButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.active ? palette.cornFlowerBlue : palette.newDarkBlue};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.newBrightBlue : palette.purpleNavy};
    }
  }
`;

export const FilterClearButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.tiny};
      align-items: center;
      padding-right: 25px;
    }
  }
`;

export const FilterRotatableChevronButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${palette.newDarkBlue};
    border-right: 2px solid ${palette.white};
    :hover {
      background-color: ${palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;

export const FilterRotatableChevronButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.tiny};
      align-items: center;
      padding-right: 25px;
    }
  }
`;

export const BoxContainer = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 5px;
  overflow: hidden;
  @media (max-width: 867px) {
    display: ${({ wide }) => {
      if (wide) return 'none';
    }};
  }
`;
