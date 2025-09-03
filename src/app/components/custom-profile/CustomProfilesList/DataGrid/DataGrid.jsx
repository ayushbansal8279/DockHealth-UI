import React from 'react';
import { GridToolbar, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid-premium';
import { StyledDataGrid } from './styled';
import { Box } from '@mui/material';

export function DefaultToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1
      }}
    >
      <GridToolbarQuickFilter
        variant="outlined"
        size="small"
        placeholder="Search"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbar />
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
        }
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