import { DataGrid } from '@material-ui/data-grid';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const DataGridWrapper = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
`;

export const ModalHeaderContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding-top: 10px;
  padding-left: 25px;
`;

export const ArrowButton = styled.button`
  cursor: pointer;
  width: 12px;
  margin-right: ${spacing.smallPlus};
`;

export const FolderIconContainer = styled.div`
  width: 100%;
  display: flex;
  grid-gap: 5px;
`;

export const ModalFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 10px;
  padding: 0px 25px 15px 25px;
`;

export const StripedDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus-within,
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus {
    outline: none;
  }

  .MuiDataGrid-columnSeparator {
    visibility: hidden;
  }

  .MuiDataGrid-row {
    cursor: pointer;
  }
  .Mui-even {
    background-color: #ffffff;
  }
  .Mui-odd {
    background-color: #f9fafc;
  }
`;
