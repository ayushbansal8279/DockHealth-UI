import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { fontWeights, fontSizes } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const ListContainer = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
  }
`;

export const UsersListContainer = styled.div`
  && {
    .MuiDataGrid-sortIcon {
      background: ${palette.brightBlue};
      color: ${palette.white};
      padding: 1px;
      border-radius: 50%;
    }
  }
`;

export const ListEntryContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 0.5rem;
  padding: 1rem 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.unknownGrey6};
  }
`;

export const PersonStatus = styled.div`
  color: ${palette.cyanBlue};
`;

export const MemberContainer = styled(Grid).attrs({ item: true })`
  && {
    margin: 0 1rem 0 2rem;
  }
`;

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    max-width: 1179px;
  }

  .MuiDataGrid-columnHeaderTitleContainer {
    display: flex;
    align-items: center;
    margin-left: -15px;
  }

  .MuiDataGrid-columnHeader {
    &:focus {
      outline: none !important;
    }
    &--sorted {
      color: ${palette.brightBlue};
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
