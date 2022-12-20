import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const UsersTableContainer = styled.div`
  width: 100%;

  && {
    .MuiDataGrid-sortIcon {
      background: ${palette.brightBlue};
      color: ${palette.white};
      padding: 1px;
      border-radius: 50%;
    }
  }
`;

export const StyledUsersTable = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;

  & > div {
    height: initial !important;
    width: initial !important;
  }
`;

export const ListLoaderContainer = styled.div`
  margin: 38px auto 16px auto;
`;

export const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root {
    max-width: 1179px;
    background-color: ${palette.blueGrey};
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
    padding-left: 24px !important;
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
      padding-left: 24px;
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
      * > .member-cell {
        text-decoration: underline;
        color: ${palette.brightBlue};
      }
    }

    &:nth-child(odd) {
      background-color: rgba(255, 255, 255, 0.4) !important;
    }
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
