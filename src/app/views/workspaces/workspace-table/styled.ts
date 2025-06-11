import { DataGridPremium } from "@mui/x-data-grid-premium";
import styled from "styled-components";

export const StyledDataGrid = styled(DataGridPremium)`
  &.MuiDataGrid-root {
    background-color: white;
    width: 100%;
    margin: 0 auto;
    min-width: 768px;
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
  }

  & .MuiDataGrid-columnHeaders {
    background-color: white;
    font-size: 16px;
    font-weight: 600;
  }

  & .MuiDataGrid-cell {
    font-size: 14px;
    color: #333;
    outline: none !important;
  }

  & .MuiDataGrid-columnSeparator {
    display: none;
  }

  & .MuiDataGrid-footerContainer {
    background-color: white;
  }

  & .MuiTablePagination-caption,
  & .MuiTablePagination-input {
    display: none;
  }
`;