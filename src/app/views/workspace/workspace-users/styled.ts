import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import { Button, Typography } from "@mui/material";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import styled from "styled-components";

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  left: 24px;
`;

export const WorkspaceUsersContainer = styled.div``;

export const WorkspaceUsersHeader = styled.div`
  display: flex;
  margin: 20px;
  justify-content: space-between;
`;

export const WorkspaceUsersTableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledActionButtonWrapper = styled(Button)`
  && {
    border-radius: 4px;
    background-color: ${palette.newDarkBlue};
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
  width: 150px;
`;

export const StyledActionButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      margin-right: 5px;
    }
  }
`;

export const StyledDataGrid = styled(DataGridPremium)`
  &.MuiDataGrid-root {
    background-color: white;
    max-width: 1179px;
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