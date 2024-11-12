/* eslint-disable unicorn/filename-case */
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import { DataGridPremium } from '@mui/x-data-grid-premium';

export const StyledDataGrid = styled(DataGridPremium)`
  margin-bottom: 48px;
  background-color: white;
  height: calc(100vh - 120px);
  overflow-y: auto;

  & .MuiDataGrid-footerContainer {
    p {
      margin-bottom: 0;
    }
  }

  &.MuiDataGrid-cell {
    font-family: inherit;
    font-weight: ${fontWeights.light};
    font-size: ${fontSizes.smallPlus};
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
