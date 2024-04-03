import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { fontWeights, fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

const HEADER_HEIGHT = 35;
const ROW_BORDER = 1;

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    max-width: 1180px;
    // border: 0 !important;
    background-color: white;
  }
  && {
    &.MuiDataGrid-sortIcon {
      background: ${palette.brightBlue};
      color: ${palette.white};
      padding: 1px;
      border-radius: 50%;
    }
  }

  & .MuiDataGrid-footerContainer {
    p {
      margin-bottom: 0;
    }
  }

  & .MuiSelect-select {
    font-family: inherit;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    flex-shrink: 0;
    margin-top: 2px;
    padding-right: 0 !important;
    padding-left: 0;
  }

  &.MuiDataGrid-columnHeaderTitleContainer {
    display: flex;
    align-items: center;
    margin-left: -15px;
  }

  .MuiDataGrid-columnHeaderTitleContainerContent {
    font-weight: ${fontWeights.regularPlus} !important;
  }

  &.MuiDataGrid-columnHeader {
    &--sorted {
      color: ${palette.brightBlue};
    }
    &:focus {
      outline: none !important;
    }
  }

  &.MuiDataGrid-columnHeaderWrapper {
    border: ${`${ROW_BORDER}px solid #e5e9f2`};
    background-color: #ffffff;
    font-size: 0.875rem;
    text-align: left;
    height: 35px;
    text-transform: uppercase;
  }

  &.MuiDataGrid-cell {
    font-family: Outfit;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
    padding-left: ${spacing.large} !important;
  }

  &.MuiDataGrid-colCell {
    outline: none !important;
    padding: 0 !important;
  }

  &.MuiDataGrid-cell {
    outline: none !important;
    color: ${palette.darkGrey};
    border-bottom: none !important;
  }

  &.MuiDataGrid-colCellTitle {
    background-color: white;
    font-family: Outfit;
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
  &.MuiDataGrid-columnsContainer {
    border-bottom: 0 !important;
    border: 0 !important;
    min-height: 35px !important;
    max-height: 35px !important;
    line-height: 35px !important;
    height: 35px !important;
  }

  &.MuiDataGrid-columnHeaderWrapper {
    background-color: white;
  }

  &.MuiDataGrid-row {
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

  &.Sorting-Arrow {
    opacity: 0;

    &:hover {
      background-color: transparent;
      cursor: default;
    }
  }

  &.MuiTablePagination-input {
    display: none;
  }
`;
