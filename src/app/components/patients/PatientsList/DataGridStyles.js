/* eslint-disable unicorn/filename-case */
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { DataGridPremium } from '@mui/x-data-grid-premium';

export const StyledDataGrid = styled(DataGridPremium)`
  margin-bottom: 48px;

  &.MuiDataGrid-root {
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
    align-items: left;
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

  &.MuiDataGrid-cell {
    font-family: inherit;
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
    font-family: inherit;
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

  &.MuiDataGrid-root--densityCompact .MuiDataGrid-cell {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  &.MuiDataGrid-root--densityStandard .MuiDataGrid-cell {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  &.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell {
    padding-top: 22px;
    padding-bottom: 22px;
  }
`;
