import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGridPremium,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from '@mui/x-data-grid-premium';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const StyledToolbar = styled(GridToolbarContainer)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 8px',
});

export function CustomToolbar() {
  return (
    <StyledToolbar>
      <Tooltip title="Columns">
        <GridToolbarColumnsButton
          startIcon={<ViewColumnIcon fontSize="small" />}
        />
      </Tooltip>

      <GridToolbarFilterButton />

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Export">
        <GridToolbarExport
          csvOptions={{ fileName: 'data-grid-export' }}
          printOptions={{ disableToolbarButton: true }}
          startIcon={<FileDownloadIcon fontSize="small" />}
        />
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <GridToolbarQuickFilter
        variant="outlined"
        size="small"
        placeholder="Search..."
        sx={{
          ml: 1,
          '& .MuiInputBase-root': {
            borderRadius: 2,
            paddingRight: 0,
          },
        }}
      />
    </StyledToolbar>
  );
}

export default function PremiumGrid({
  apiRef,
  columns,
  rows,
  handleRecordClick,
}) {
  console.log('rows', rows);
  return (
    <DataGridPremium
      sx={{
        '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
          color: 'grey.600',
        },
        flex: 1,
        '& .MuiDataGrid-toolbarContainer': {
          borderBottom: '1px solid #e0e0e0',
        },
      }}
      apiRef={apiRef}
      columns={columns}
      rows={rows}
      onRowClick={(params) => handleRecordClick(params.row)}
      pagination
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10, page: 0 } },
      }}
      slots={{ toolbar: CustomToolbar }}
      loading={rows.length === 0}
      filterMode="client"
      disableColumnFilter={false}
      disableColumnMenu={false}
      
    />
  );
}
