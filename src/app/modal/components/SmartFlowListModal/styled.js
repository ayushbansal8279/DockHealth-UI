import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';
import spacing from 'styles/spacing';

export const DataGridWrapperStyled = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
`;

export const ModalHeaderContainerStyled = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-top: 10px;
  padding-left: 25px;
`;

export const ArrowButtonStyled = styled.button`
  cursor: pointer;
  width: 12px;
  margin-right: ${spacing.smallPlus};
`;

export const ModalHeaderStyled = styled.div`
  flex-grow: 2;
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const SearchStyled = styled.div`
  flex-grow: 1;
  padding-right: 30px;
`;

export const FolderIconContainerStyled = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
`;

export const ModalFooterStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 10px;
  padding: 0px 25px 15px 25px;
`;

export const DataGridStyled = styled(DataGrid)`
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus-within,
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus {
    outline: none;
  }

  &.MuiDataGrid-columnSeparator {
    visibility: hidden;
  }

  &.MuiDataGrid-row {
    cursor: pointer;
  }
  &.Mui-even {
    background-color: #ffffff;
  }
  &.Mui-odd {
    background-color: #f9fafc;
  }
`;
