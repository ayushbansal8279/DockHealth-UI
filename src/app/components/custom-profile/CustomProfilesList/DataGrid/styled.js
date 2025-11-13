import { fontSizes, fontWeights } from "@/app/styles/font";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import styled from "styled-components";

export const StyledDataGrid = styled(DataGridPremium)`
  background-color: white;
  flex: 1;
  min-height: 200px;

  & .MuiDataGrid-cell {
    font-family: inherit;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  & .MuiDataGrid-cellContent {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .MuiDataGrid-columnHeaders {
    font-weight: ${fontWeights.regularPlus};
  }

  & .MuiDataGrid-row:hover,
  & .MuiDataGrid-cell:hover {
    cursor: pointer;
  }

  & .MuiDataGrid-footerContainer {
    z-index: 1000;
    background-color: white;
    p {
      margin-bottom: 0;
    }
  }

  & .MuiDataGrid-columnSeparator {
    visibility: visible;
    cursor: col-resize;
    color: rgba(0, 0, 0, 0.12);

    &:hover {
      color: rgba(0, 0, 0, 0.38);
    }

    &:active {
      color: rgba(0, 0, 0, 0.54);
    }
  }

  &.MuiDataGrid-root--densityStandard .MuiDataGrid-cell,
  & .MuiDataGrid-row {
  }

  & .MuiDataGrid-filterFormDeleteIcon {
    width: auto;
    margin-right: 4px;
    padding: 15px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .MuiDataGrid-filterFormDeleteIcon button {
    padding: 2px;
    min-width: 0;
    width: auto;
    height: auto;
  }

  & .MuiDataGrid-filterFormColumnInput {
    width: 40%;
  }

  & .MuiDataGrid-filterFormLogicOperatorInput {
    width: 15%;
  }

  & .MuiPopper-root {
    left: auto !important;
    right: 0 !important;
  }

  & .MuiDataGrid-toolbarContainer .MuiInputBase-root {
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    padding-right: 0;
  }

  & .MuiDataGrid-toolbarContainer .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  & .MuiDataGrid-toolbarContainer .MuiSvgIcon-root {
    color: grey;
  }
`;