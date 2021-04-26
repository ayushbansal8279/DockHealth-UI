import styled from 'styled-components';
import { Popover, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import { LoaderFillElement } from 'components/task/TasksSkeletonLoader/styled';

export const StyledPopover = withStyles({
  paper: {
    border: 'none',
    boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.15)',
    minWidth: 230,
    width: ({ width }) => `${width || 230}px`,
  },
})(Popover);

export const StyledButton = styled.button`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  text-align: left;
`;

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  margin-left: ${spacing.tiny};
`;

export const InputBox = styled.div`
  display: flex;
  padding: ${spacing.smallPlus} ${spacing.smallPlus};
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  font-family: 'Roboto Condensed', sans-serif;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;

export const ListContainer = styled.div`
  max-height: 264px;
  overflow-y: auto;
  padding: 2px;
  padding-right: 6px;
  border-top: 1px solid ${palette.coolGrey2};
`;

export const Row = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.small} ${spacing.small};
  font-family: 'Roboto Condensed', sans-serif;
  cursor: pointer;
  margin: 2px;
  border-radius: 4px;
  color: ${({ isSelected }) =>
    isSelected ? palette.mediumGrey : palette.coolGrey1};
  background-color: ${({ isSelected }) =>
    isSelected ? `${palette.brightBlue}12` : 'transparent'};

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const UnassignRow = styled.div`
  padding-bottom: 2px;
  border-bottom: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.coolGrey2}` : '0px'};
`;

export const StyledGrid = styled(Grid)`
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  padding-right: ${spacing.tiny};
`;

export const PatientName = styled(StyledGrid)`
  text-align: initial;
`;

export const LoaderItem = styled(LoaderFillElement)`
  margin: ${spacing.regular} ${spacing.large};
`;

export const LoaderContainer = styled.div`
  padding: ${spacing.smallPlus} 0;
`;

export const NoPatientFound = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  text-align: center;
  color: ${palette.coolGrey1};
  padding-bottom: ${spacing.tiny};
`;
