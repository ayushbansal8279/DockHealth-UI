import { styled } from '@mui/material/styles';
import * as MUI from '@mui/x-data-grid';
import { typography } from 'styles/palette';

export const DataGrid = styled(MUI.DataGrid)`
  margin-bottom: 48px;

  &.MuiDataGrid-root {
    background-color: white;
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
`;
