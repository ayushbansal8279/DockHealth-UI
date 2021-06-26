/* eslint-disable import/prefer-default-export */
/* eslint-disable unicorn/filename-case */
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import { fontWeights, fontSizes } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    max-width: 1179px;
  }

  .MuiDataGrid-columnHeaderTitleContainer {
    display: flex;
    align-items: center;
    margin-left: -15px;

    &:hover {
      & > .Sorting-Arrow {
        opacity: 0.5;
      }
    }
  }

  .MuiDataGrid-columnHeader--sortable {
    &:focus {
      outline: none;
    }
  }

  .MuiDataGrid-cell {
    font-family: Roboto Condensed;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
    padding-left: ${spacing.large} !important;
  }

  .MuiDataGrid-colCell {
    outline: none !important;
    padding: 0 !important;
  }

  .MuiDataGrid-cell {
    outline: none !important;
    color: ${palette.darkGrey};
  }

  .MuiDataGrid-colCellTitle {
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

  .MuiDataGrid-columnSeparator {
    visibility: hidden;
  }

  .MuiDataGrid-columnHeaderWrapper {
    background-color: white;
  }

  .MuiDataGrid-row {
    background-color: white;
    cursor: default;

    &:hover {
      background-color: none;
      * > .people-cell {
        cursor: pointer;
        text-decoration: underline;
        color: ${palette.brightBlue};
      }
    }

    &:nth-child(odd) {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }

  .people-cell-container {
    display: flex;
    align-items: center;
  }

  .Sorting-Arrow {
    opacity: 0;

    &:hover {
      background-color: transparent;
      cursor: default;
    }
  }

  .MuiTablePagination-caption:nth-of-type(1) {
    display: none;
  }

  .MuiTablePagination-input {
    display: none;
  }
`;
