import React from 'react';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { StyledDataGrid } from './styled';
import { Box, Tooltip } from '@mui/material';

export function DefaultToolbar({
  showExport = true,
  showSearch = true,
  showColumns = true,
  showFilter = true,
  placeholder,
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
            width: placeholder.length > 15 ? 240 : 200,
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
  // toolbar: Toolbar = DefaultToolbar,
  loading,
  onRecordClick,
  showToolbar = true,
  // showExport = true,
  // showSearch = true,
  // showColumns = true,
  // showFilter = true,
  placeholder = 'Search within results',
  ...props
}) => {
  const apiRef = useGridApiRef();
  
  // Only use useKeepGroupedColumnsHidden if row grouping is actually configured
  const hasRowGrouping = props.initialState?.rowGrouping?.model?.length > 0;
  const baseInitialState = {
    ...props.initialState,
    // Only include rowGrouping and aggregation if they're provided in props
    ...(props.initialState?.rowGrouping && {
      rowGrouping: props.initialState.rowGrouping,
    }),
    ...(props.initialState?.aggregation && {
      aggregation: props.initialState.aggregation,
    }),
  };

  const initialState = hasRowGrouping
    ? useKeepGroupedColumnsHidden({
        apiRef: apiRef,
        initialState: baseInitialState,
      })
    : baseInitialState;

  const paginationMode = props.paginationMode ?? 'client';
  const sortingMode = props.sortingMode ?? 'client';
  
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
      rowCount={paginationMode === 'server' ? rowCount : undefined}
      paginationMode={paginationMode}
      sortingMode={sortingMode}
      headerHeight={35}
      pagination
      showColumnRightBorder
      showCellRightBorders
      filterMode={props.filterMode ?? 'client'}
      // slots={{
      //   noRowsOverlay: () => (
      //     <Box
      //       display="flex"
      //       justifyContent="center"
      //       alignItems="center"
      //       height="100%"
      //     >
      //       No records found
      //     </Box>
      //   ),
      //   ...(showToolbar
      //     ? {
      //         toolbar: () => (
      //           <Toolbar
      //             showExport={showExport}
      //             showSearch={showSearch}
      //             showColumns={showColumns}
      //             showFilter={showFilter}
      //             placeholder={placeholder}
      //           />
      //         ),
      //       }
      //     : {}),
      // }}
      // slotProps={showToolbar ? { panel: { disablePortal: true } } : {}}
      disableColumnMenu={false}
      // disableSelectionOnClick
      disableRowSelectionOnClick
      // disableColumnFilter={false}
      // disableDensitySelector
      disableColumnResize={false}
      loading={loading}
      onRowClick={onRecordClick}
      apiRef={apiRef}
      initialState={initialState}
      showToolbar={showToolbar}
      multipleColumnsSortingMode="always"
      disablePivoting
      {...props}
    />
  );
};

export default ReusableDataGrid;