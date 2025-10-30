import { Button, Checkbox, Collapse, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { Close } from '@mui/icons-material';
import { fontSizes, fontWeights } from 'styles/font';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { typography } from 'styles/palette';



export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ width }) => width || '450px'};
  max-width: 100vw;
  font-family: inherit;
  background-color: white;
  height: 90%;
`;
export const ModalWrapperWithPadding = styled(ModalWrapper)`
  padding: ${spacing.largePlus};
`;

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiButtonBase-root {
      position: absolute;
      top: 8px;
      right: 8px;
      display: block;
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    &.MuiSvgIcon-root {
      width: 16px;
      height: 16px;
    }
  }
`;

export const Container = styled.div`
  height: 100%;
  width: 384px;
  overflow: hidden;
`;

export const FlexButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
`;

export const CancelButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px ${spacing.large};
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid ${palette.oPlusRed};
  color: ${palette.oPlusRed};
  font-family: Outfit;
  text-align: center;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '200px')};

  &:disabled {
    border-color: ${palette.shadowBlue};
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  height: 40px;
  padding: 22px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  text-align: center;
  font-family: Outfit;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '200px')};

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }

  &:disabled {
    color: ${palette.white};
    background-color: ${palette.shadowBlue};
  }
`;

export const StepsContainer = styled.div`
  display: flex;
  height: 100%;
  widht: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  transform: translateX(-${({ stepIndex }) => stepIndex * 384 || 0}px);
  transition: transform 0.3s ease-out;
`;

export const Step = styled.div`
  height: 100%;
  flex: 384px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;


export const QuickAddInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: ${fontSizes.smallPlus};

  &:before {
    position: absolute;
    top: 50%;
    left: 15px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.blueOcean};
    font-size: ${fontSizes.large};
  }

  ${({ isFocused }) =>
    isFocused &&
    `
      &:before {
        opacity: 0;
      }
    `}
`;

export const QuickAddInput = styled.input`
  height: auto;
  padding: ${spacing.smallPlus} ${spacing.huge};
  margin-bottom: 0;
  border-color: ${palette.coolGrey2};
  border-top: none;
  font-size: ${fontSizes.regular};
  box-shadow: none;

  &:disabled {
    background-color: transparent;
  }

  &:focus {
    border-top: none;
    border-color: ${palette.coolGrey2};
    box-shadow: none;
  }
`;

export const TitleWithButtonWrapper = styled.div`
  position: relative;
  padding-left: ${spacing.giga};
  overflow: visible;

  & > button {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    color: ${palette.brightBlue};
    cursor: pointer;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${fontSizes.regularPlus};
  color: ${palette.offBlack};
  font-family: inherit;
  text-align: Center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  gap: 8px;
  align-self: stretch;
  text-align: center;
  font-family: Outfit;
  font-size: 22px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px; /* 113.636% */
  text-transform: capitalize;
`;

export const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.darkGrey};
  font-size: ${fontSizes.regular};
  text-align: center;
`;

export const ListsWrapper = styled.div`
  flex: 1;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow: auto;
`;

export const ListItemTextButton = styled.button`
  flex: 1;
  margin: 0;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  font-size: ${fontSizes.regular};
  text-align: left;
  outline: none;
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
`;

export const NextArrow = styled(ChevronRightIcon)`
  color: ${palette.offBlack} !important;
`;

export const ScopeHeadingContainer = styled.div`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  appearance: none;
  border-radius: 0;
  background-color: ${({ isSelected }) =>
    isSelected ? palette.brightBlueWithAlpha : 'transparent'};

  &:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const EmptyMessage = styled.p`
  color: ${palette.coolGrey2};
  margin-top: ${spacing.huge};
  text-align: center;
`;

// Add these new styled components to your styled.js
export const ScopeList = styled(List)`
  width: 100%;
  padding: 0;
`;

export const ScopeListItemButton = styled(ListItemButton)`
  && {
    padding-left: ${spacing.regularPlus};
    padding-right: ${spacing.regularPlus};
    &.Mui-selected {
      background-color: ${palette.primary};
      color: ${palette.primary};
    }
    &.Mui-selected:hover {
      background-color: ${palette.primary};
    }
  }
`;

export const ScopeListItemText = styled(ListItemText)`
  & .MuiTypography-root {
    font-family: Outfit;
    font-size: ${fontSizes.regular};
    font-weight: ${({ selected }) => (selected ? fontWeights.medium : fontWeights.regular)};
  }
`;

export const NestedList = styled(List)`
  padding-left: ${spacing.small};
  margin-left: ${spacing.small};

`;

export const ScopeCheckbox = styled(Checkbox)`
  && {
    color: ${palette.primary};
    padding: ${spacing.small};
    
    &.Mui-checked {
      color: ${palette.primary};
    }
  }
`;

export const ScopeListItemName = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px ;
`;

export const ScopeListCategoryName = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px ;
`;

export const ScopeName = styled.span`
  flex: 1;
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  color: ${palette.offBlack};
  margin-left: ${spacing.small};
`;