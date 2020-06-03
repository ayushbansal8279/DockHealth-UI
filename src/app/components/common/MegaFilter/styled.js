import styled from 'styled-components';
import { Typography, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const MegaFilterPopover = withStyles({
  paper: {
    right: '40px', // per design
    left: '104px', // per design
    border: 'none',
    boxShadow: '0px 4px 10px rgba(204, 204, 204, 0.25)',
  },
})(Popover);

export const FilterButtonLabel = withStyles({
  root: {
    color: palette.coolGrey1,
    display: 'inline-block',
    marginRight: spacing.tiny,
  },
})(Typography);

export const Container = styled.div`
  background-color: white;
  padding: ${spacing.large} ${spacing.large} ${spacing.small};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const MegaFilterHeader = styled.div`
  display: flex;
  margin-bottom: ${spacing.largePlus};
  justify-content: space-between;
`;

export const MegaFilterLabel = styled.label`
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.small};
`;

export const MegaFilterBoldedLabel = styled.span`
  font-weight: ${fontWeights.bold};
`;

export const Filters = styled.div`
  display: flex;
  padding-bottom: ${spacing.regularPlus};
  overflow-x: scroll;

  & > div {
    margin-right: ${spacing.large};
  }

  // Showing scrollbar always
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:horizontal {
    height: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export const StyledFilter = styled.div``;

export const FilterList = styled.div`
  max-height: 380px; // per design
  margin-top: ${spacing.regular};
  overflow-y: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: ${palette.coolGrey2};
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export const FilterSelected = styled.div`
  border-bottom: 1px solid ${palette.blueGrey};
  margin-bottom: ${spacing.small};
  padding-bottom: ${spacing.small};
`;

export const FilterSearched = styled.div`
  border-bottom: 1px solid ${palette.blueGrey};
  margin-bottom: ${spacing.small};
  padding-bottom: ${spacing.small};
`;

export const FilterLabel = styled.label`
  color: ${palette.lightGrey};
  font-weight: ${fontSizes.bold};
  font-size: ${fontSizes.small};
  text-transform: uppercase;
`;

export const StyledFilterRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 168px; // per design
  height: 30px; // per design
  background-color: ${props =>
    props.isSelected ? palette.darkBlue : palette.blueGrey};
  color: ${props => (props.isSelected ? 'white' : 'black')};
  border-radius: 4px;
  font-size: ${fontSizes.small};
  cursor: pointer;
  margin-bottom: ${spacing.tiny};
  padding: 0 ${spacing.small};

  & > span {
    margin-left: ${spacing.small};
  }

  ${props =>
    !props.isSelected &&
    `&:hover {
      background-color: ${palette.lightGrey};
      color: white;}`};
`;

export const StyledUnassignedIcon = styled.img`
  width: 25px; // per design
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  margin-left: ${spacing.small};
  color: ${palette.brightBlue};
  font-size: ${fontSizes.small};
  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};
`;

export const MemberOptionLabel = styled.span`
  width: 150px;
`;

export const OptionLabel = styled.span`
  width: 180px;
`;

export const OptionCount = styled.div`
  margin-left: ${spacing.small};
  color: ${palette.coolGrey2};
`;

export const MegaFilterOptions = styled.div`
  display: flex;
`;

export const MegaFilterSearchContainer = styled.div`
  display: flex;
`;

export const MegaFilterSearchInputContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: ${spacing.small};
`;

export const MegaFilterSearchInput = styled.input`
  font-size: ${fontSizes.small};
  width: 64px; // per design
  color: ${palette.lightGrey};
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  border: none;

  &:focus {
    color: ${palette.darkGrey};
    border-bottom: 1px solid #c1ccda;
    width: 320px; // per design
    outline: none;
    padding-bottom: ${spacing.small};
    padding-right: ${spacing.regular};
  }
`;

export const MegaFilterClearIcon = styled.img`
  opacity: ${props => (props.isInputFocused ? '1' : '0')};
  cursor: ${props => (props.isInputFocused ? 'pointer' : 'default')};
  position: absolute;
  right: 0;
`;

export const DueDateRangePickerRowContainer = styled.div`
  margin-top: ${spacing.regular};
  font-size: ${fontSizes.small};
`;

export const DueDateRangePickerInputsWrapper = styled.div`
  margin-top: ${spacing.small};
  width: 168px; // per design
  display: flex;
  flex-direction: row;
`;

export const DueDateInput = styled.input`
  display: block;
  flex: 1;
  padding: 0 ${spacing.small};
  overflow: auto;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 2px;
  color: ${palette.coolGrey2};
`;
