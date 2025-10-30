import { fontSizes, fontWeights } from "@/app/styles/font";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import styled from "styled-components";

export const BackButtonContainer = styled.div`
  margin: 15px 15px 0px 145px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserName = styled.div`
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regularPlus};
`;

export const EventDurationContainer = styled.div`
  font-size: ${fontSizes.smallPlus};
  margin: 5px 0px 0px 145px;
`;

export const StyledDataGrid = styled(DataGridPremium)`
  background-color: white;
  height: calc(93vh - 120px);

  &.MuiDataGrid-root {
    max-width: 1179px;
  }

  &.MuiDataGrid-cell {
    font-family: inherit;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
  }

  & .MuiDataGrid-cellContent {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 100%;
  }

  & .MuiDataGrid-columnHeaders {
    font-weight: ${fontWeights.regularPlus};
  }

  & .MuiDataGrid-row:hover,
  & .MuiDataGrid-cell:hover {
    cursor: pointer;
  }

  & .MuiDataGrid-footerContainer {
    position: sticky;
    bottom: 0;
    z-index: 1000;
    background-color: white;
    p {
      margin-bottom: 0;
    }
  }

  & .MuiDataGrid-columnSeparator {
    visibility: hidden;
  }

  &.MuiDataGrid-root--densityStandard .MuiDataGrid-cell {
    padding-top: 5px;
    padding-bottom: 5px;
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
    width: 40%
  }

  & .MuiDataGrid-filterFormLogicOperatorInput{
    width: 15%
  }

  & .MuiPopper-root {
    left: auto !important;
    right: 0 !important;
  }

  & .MuiInputBase-root {
    width: 150px
  }
`;
