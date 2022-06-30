/* eslint-disable import/prefer-default-export */
/* eslint-disable unicorn/filename-case */
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const ROW_HEIGHT = 35;
const HEADER_HEIGHT = 35;
const ROW_MARGIN = 2;
const ROW_BORDER = 1;

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    max-width: 1180px;
    border: 0 !important;

    // calculating a height of a table is a workaround - MUI v4 doesn't support space beetween rows
    height: ${({ rows, pageSize, page }) => {
      let rowsLength;
      if (rows.length - page * pageSize > pageSize) rowsLength = pageSize;
      else {
        rowsLength = rows.length - page * pageSize;
      }

      return (
        (rowsLength + 1) * (ROW_HEIGHT + ROW_MARGIN + ROW_BORDER) +
        HEADER_HEIGHT
      );
    }};

    .MuiDataGrid-renderingZone {
      ${({ rows, pageSize, page }) => {
        let rowsLength;
        if (rows.length - page * pageSize > pageSize) rowsLength = pageSize;
        else {
          rowsLength = rows.length - page * pageSize;
        }
        return `max-height: ${(rowsLength + 1) *
          (ROW_HEIGHT + ROW_MARGIN + ROW_BORDER) +
          HEADER_HEIGHT}px !important`;
      }}
    }

    .MuiDataGrid-window {
      top: 35px !important;
    }
    .MuiDataGrid-columnsContainer {
      top: ${`-${ROW_MARGIN}px`};
    }
  }
  && {
    .MuiDataGrid-sortIcon {
      background: ${palette.brightBlue};
      color: ${palette.white};
      padding: 1px;
      border-radius: 50%;
    }
  }
  .MuiDataGrid-columnHeaderTitleContainer {
    display: flex;
    align-items: center;
    margin-left: -15px;
  }

  .MuiDataGrid-columnHeader {
    &--sorted {
      color: ${palette.brightBlue};
    }
    &:focus {
      outline: none !important;
    }
  }

  .MuiDataGrid-colCellTitle {
    color: #3d4858;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 0.875rem !important;
  }

  .MuiDataGrid-columnHeaderWrapper {
    border: ${`${ROW_BORDER}px solid #e5e9f2`};
    background-color: #ffffff;
    font-size: 0.875rem;
    text-align: left;
    height: 35px;
    text-transform: uppercase;
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
    border-bottom: none !important;
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
  .MuiDataGrid-columnsContainer {
    border-bottom: 0 !important;
    border: 0 !important;
    min-height: 35px !important;
    max-height: 35px !important;
    line-height: 35px !important;
    height: 35px !important;
  }

  .MuiDataGrid-columnHeaderWrapper {
    background-color: white;
  }

  .MuiDataGrid-row {
    width: 100% !important;
    background-color: white;
    cursor: default;
    margin-bottom: 2px;
    border: ${`${ROW_BORDER}px solid #e5e9f2`};
    background-color: #ffffff !important;
    font-size: 0.875rem;
    text-align: left;
    height: ${HEADER_HEIGHT}px;

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

  .Sorting-Arrow {
    opacity: 0;

    &:hover {
      background-color: transparent;
      cursor: default;
    }
  }

  .MuiTablePagination-input {
    display: none;
  }
`;
