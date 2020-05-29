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
`;

export const MegaFilterHeader = styled.div`
  display: flex;
  margin-bottom: ${spacing.largePlus};
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
  overflow-x: auto;

  & > div {
    margin-right: ${spacing.large};
  }
`;

export const StyledFilter = styled.div``;

export const FilterList = styled.div`
  max-height: 380px; // per design
  margin-top: ${spacing.regular};
  overflow-y: scroll;
`;

export const FilterSelected = styled.div`
  border-bottom: 1px solid ${palette.blueGrey};
  margin-bottom: ${spacing.tiny};
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
  width: 208px; // per design
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
  margin-left: ${spacing.huge};
  color: ${palette.brightBlue};
  font-size: ${fontSizes.small};
  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};
`;
