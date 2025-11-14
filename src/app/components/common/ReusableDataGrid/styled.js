import { DataGridPremium } from '@mui/x-data-grid-premium';
import styled from 'styled-components';

export const StyledDataGrid = styled(DataGridPremium)`
  background-color: white;
  flex: 1;
  min-height: 200px;

  & .MuiDataGrid-cell {
    display: flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    height: auto;
  }

  & .MuiDataGrid-cellContent {
    display: flex;
    align-items: center;
    width: 100%;
  }

  & .MuiDataGrid-footerContainer {
    z-index: 1000;
    background-color: white;
    p {
      margin-bottom: 0;
    }
  }
`;