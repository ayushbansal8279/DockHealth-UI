/* eslint-disable unicorn/filename-case */
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    // max-width: 1179px;
  }
  && {
    &.MuiDataGrid-sortIcon {
      background: ${palette.brightBlue};
      color: ${palette.white};
      padding: 1px;
      border-radius: 50%;
    }
  }

  &.MuiDataGrid-columnHeaderTitleContainer {
    display: flex;
    align-items: left;
    margin-left: -15px;
  }

  &.MuiDataGrid-columnHeader {
    &--sorted {
      color: ${palette.brightBlue};
    }
    &:focus {
      outline: none !important;
    }
  }

  &.MuiDataGrid-cell {
    font-family: Roboto Condensed;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
  }

  &.MuiDataGrid-colCell {
    outline: none !important;
    padding: 0 !important;
  }

  &.MuiDataGrid-cell {
    outline: none !important;
    color: ${palette.darkGrey};
  }

  &.MuiDataGrid-colCellTitle {
    background-color: white;
    font-family: Roboto Condensed;
    font-size: ${fontSizes.small};
    font-weight: ${fontWeights.regularPlus} !important;
    padding-left: 0;
    order: 2;

    &:only-child {
      order: 1;
      padding-left: ${spacing.large};
    }
  }

  &.MuiDataGrid-columnSeparator {
    visibility: hidden;
  }

  &.MuiDataGrid-columnHeaderWrapper {
    background-color: white;
  }

  &.MuiDataGrid-row {
    background-color: white;
    cursor: default;

    &:hover {
      * > .patient-cell {
        cursor: pointer;
        text-decoration: underline;
        color: ${palette.brightBlue};
      }
    }

    &:nth-child(odd) {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }

  &.Sorting-Arrow {
    opacity: 0;

    &:hover {
      background-color: transparent;
      cursor: default;
    }
  }

  &.MuiTablePagination-caption:nth-of-type(1) {
    display: none;
  }

  &.MuiTablePagination-input {
    display: none;
  }
`;
