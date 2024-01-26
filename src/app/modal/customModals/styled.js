import { IconButton, Box, Modal } from '@mui/material';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import { Close } from '@mui/icons-material';
import Select from 'components/common/Select/Select';

export const CustomModal = styled(Modal)``;

export const ListModalWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: inherit;
  background-color: white;
  width: 600px;
  min-height: 340px;
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.giga};
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.huge};
`;

export const Body = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: ${spacing.huge};
  max-width: 798px;
  margin: 0 auto;
  padding-top: 10px;
  color: ${palette.mediumGrey};
  font-family: inherit;
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
`;

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiIconButton-root {
      position: absolute;
      top: 8px;
      right: 8px;
      display: block;
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    &.MuiClose-root {
      width: 16px;
      height: 16px;
    }
  }
`;

export const SelectOptionColor = styled(Select)`
  &.MuiFormControl-root {
    width: 60px;
  }

  & .MuiInputBase-root {
    //responsible for endAdornment styles
    & svg {
      width: 7px;
    }
    //background-color: transparent !important;

    &.MuiFilledInput-underline:before {
      //border-bottom: none;
    }
  }
`;

export const SelectParentDropdown = styled(Select)`
  &.MuiFormControl-root {
    width: 176px;
  }
`;

export const SelectParentOption = styled(Select)`
  &.MuiFormControl-root {
    width: 176px;
  }
`;
