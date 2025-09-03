import React from 'react';
import {
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import { StyledDataGrid } from './styled';
import { Box } from '@mui/material';

export function DefaultToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
      }}
    >
      <GridToolbarQuickFilter
        variant="outlined"
        size="small"
        placeholder="Search"
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '0.8rem',
            paddingRight: 0,
            height: 32,
          },
          '& .MuiOutlinedInput-input': {
            padding: '4px 8px',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1rem',
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbar sx={{ pb: 1 }} />
      </Box>
    </GridToolbarContainer>
  );
}

const ReusableDataGrid = ({
  columns,
  rows,
  getRowId = (row) => row.id,
  rowCount,
  toolbar: Toolbar = DefaultToolbar,
  loading,
  onRecordClick,
  ...props
}) => {
  return (
    <StyledDataGrid
      sx={{
        '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
          color: 'grey.600',
        },
      }}
      columns={columns}
      rows={rows}
      getRowId={getRowId}
      rowCount={rowCount ?? rows.length}
      headerHeight={35}
      pagination
      showColumnRightBorder
      showCellRightBorders
      filterMode="client"
      slots={{ toolbar: Toolbar }}
      slotProps={{ panel: { disablePortal: true } }}
      disableColumnMenu
      disableSelectionOnClick
      disableRowSelectionOnClick
      disableColumnResize
      disableColumnFilter={false}
      disableDensitySelector
      loading={loading ?? rows.length === 0}
      onRowClick={onRecordClick}
      {...props}
    />
  );
};

export default ReusableDataGrid;