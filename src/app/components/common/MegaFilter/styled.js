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
  padding: 0 0 6px; // per design
  border-bottom: 1px solid ${palette.blueGrey};
  margin-bottom: ${spacing.smallExtraPlus};
`;

export const FilterLabel = styled.label`
  color: ${palette.lightGrey};
  font-weight: ${fontSizes.bold};
  font-size: ${fontSizes.small};
`;

export const StyledFilterRow = styled.div`
  background-color: ${props =>
    props.isSelected ? palette.darkBlue : palette.blueGrey};
  width: 208px; // per design
  height: 30px; // per design
  font-size: ${fontSizes.small};
  margin-bottom: ${spacing.small};
  border-radius: 4px;
  cursor: pointer;
  color: ${props => (props.isSelected ? 'white' : 'black')};
  display: flex;
  align-items: center;
  padding: 0 ${spacing.small};
  position: relative;

  & > span {
    margin-left: 8px;
  }

  &:hover {
    ${props =>
      !props.isSelected &&
      `background-color: ${palette.lightGrey};
       color: white;`};
  }
`;

export const StyledUnassignedIcon = styled.img`
  width: 25px; // per design
`;
