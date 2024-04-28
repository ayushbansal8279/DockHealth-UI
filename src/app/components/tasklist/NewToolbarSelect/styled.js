import styled from 'styled-components';
import palette from 'styles/palette';
import { Button, Select as MuiSelect, Typography } from '@mui/material';
import { fontSizes, fontWeights } from '@/app/styles/font';
import spacing from '@/app/styles/spacing';

export const Select = styled(MuiSelect)`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.isOpen ? palette.newBrightBlue : palette.newDarkBlue};
  color: ${palette.white};
  height: 32px;
  width: auto;
  border-radius: 4px;

  &:hover {
    background: ${(props) =>
      props.isOpen ? palette.cornFlowerBlue : palette.purpleNavy};
  }

  & .switchIcon > path {
    fill: ${(props) => props.iconcoloractive ?? palette.white};
  }
`;

export const SelectWrapper = styled.div`
  @media print {
    display: none;
  }
`;

export const SelectIcon = styled.span`
  padding-right: 5px;
  filter: brightness(0) invert(1);
`;

export const OptionsMenu = styled.div`
  padding: 5px;
`;

export const ButtonContainer = styled(Button)`
  && {
    border-radius: 4px 0 0 4px;
    background-color: ${(props) =>
      props.active ? palette.newBrightBlue : palette.newDarkBlue};
    border-right: 1px solid ${palette.white};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.cornFlowerBlue : palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
`;


export const ButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      font-family: Outfit;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      color: ${palette.white};
      text-transform: none;
    }
  }
`;

export const RotatableChevronButtonWrapper = styled(Button)`
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

export const RotatableChevronButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.largePlus};
      align-items: center;
    }
  }
`;

export const BoxContainer = styled.div`
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  height: 32px;
  padding-right: 30px;
`;

export const PopoverWrapper = styled.div`
  padding: 5px;
`;