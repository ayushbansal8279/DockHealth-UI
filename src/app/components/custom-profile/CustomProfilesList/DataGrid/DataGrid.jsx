import React from 'react';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import { StyledDataGrid } from './styled';
import { Box, Tooltip } from '@mui/material';

export function DefaultToolbar({
  showExport = true,
  showSearch = true,
  showColumns = true,
  showFilter = true,
  placeholder = 'Search',
}) {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
      }}
    >
      {showSearch ? (
        <GridToolbarQuickFilter
          variant="outlined"
          size="small"
          placeholder={placeholder}
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
      ) : (
        <Box></Box>
      )}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {showColumns && (
          <Tooltip title="Show/Hide columns" arrow>
            <GridToolbarColumnsButton />
          </Tooltip>
        )}
        {showFilter && (
          <Tooltip title="Filter results" arrow>
            <GridToolbarFilterButton />
          </Tooltip>
        )}
        {showExport && (
          <Tooltip title="Export data" arrow>
            <GridToolbarExport />
          </Tooltip>
        )}
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
  showToolbar = true,
  showExport = true,
  showSearch = true,
  showColumns = true,
  showFilter = true,
  placeholder = 'Search',
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
      rowCount={rowCount ?? rows?.length}
      headerHeight={35}
      pagination
      showColumnRightBorder
      showCellRightBorders
      filterMode="client"
      slots={
        showToolbar
          ? {
              toolbar: () => (
                <Toolbar
                  showExport={showExport}
                  showSearch={showSearch}
                  showColumns={showColumns}
                  showFilter={showFilter}
                  placeholder={placeholder}
                />
              ),
            }
          : {}
      }
      slotProps={showToolbar ? { panel: { disablePortal: true } } : {}}
      disableColumnMenu
      disableSelectionOnClick
      disableRowSelectionOnClick
      disableColumnResize
      disableColumnFilter={false}
      disableDensitySelector
      loading={loading}
      onRowClick={onRecordClick}
      {...props}
    />
  );
};

export default ReusableDataGrid;