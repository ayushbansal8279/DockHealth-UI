import React from 'react';
import {
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { StyledDataGrid } from './styled';

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
      slotProps={{
        panel: {
          disablePortal: false,
          sx: {
            '& .MuiDataGrid-filterForm .MuiFormControl-root': {
              width: 'auto !important',
              minWidth: 0,
              flex: '0 0 auto',
            },
          },
        },
        toolbar: { placeholder },
      }}
      multipleColumnsSortingMode="always"
      disablePivoting
      {...props}
    />
  );
};

export default ReusableDataGrid;
