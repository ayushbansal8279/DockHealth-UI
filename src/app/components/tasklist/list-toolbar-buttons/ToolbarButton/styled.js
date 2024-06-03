import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const CustomizeButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.$disableButton
        ? palette.coolGrey1
        : props.active
        ? palette.newBrightBlue
        : palette.newDarkBlue};
    border-right: ${(props) =>
      props.$hasPopover ? `1px solid ${palette.white};` : ''};
    // border-radius: 5px 0px 0px 5px;
    :hover {
      background-color: ${(props) =>
        props.$disableButton
          ? palette.coolGrey1
          : props.active
          ? palette.cornFlowerBlue
          : palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }

  & .switchIcon > path {
    fill: ${palette.white};
  }

  @media print {
    display: none;
  }
`;

export const CustomizeButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      font-family: 'Outfit', sans-serif;
      color: ${palette.white};
      // font-weight: ${fontWeights.light};
      // display: inline-block;
      margin-left: ${({ icon }) => (!!icon ? spacing.small : '')};
      text-transform: none;
      font-family: Outfit;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
    }
  }
`;

export const CustomizeRotatableChevronButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.$disableButton
        ? palette.coolGrey1
        : props.active
        ? palette.cornFlowerBlue
        : palette.newDarkBlue};
    // border-right: 2px solid ${palette.white};
    // border-radius: 0px 5px 5px 0px;
    :hover {
      background-color: ${(props) =>
        props.$disableButton
          ? palette.coolGrey1
          : props.active
          ? palette.cornFlowerBlue
          : palette.purpleNavy};
    }
  }

  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;

// export const SelectIcon = styled.span`
//   border-right: 2px solid ${palette.white};
//   height: 40px;
//   display: flex;
//   align-items: center;
//   padding-right: 10px;
//   filter: brightness(0) invert(1);
// `;

export const CustomizeRotatableChevronButtonLabel = styled(Typography)`
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

export const ToolbarButtonBoxContainer = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 4px;
  overflow: hidden;
  height: 32px;
`;
