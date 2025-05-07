import React from 'react';
import { useGridApiRef, DataGridPremium } from '@mui/x-data-grid-premium';
import moment from 'moment';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { List, PropertiesTooltipContainer } from './styled';
import { formatKey } from './helper';

const MeteringTable = ({
  billingData,
  onPaginationChange,
  defaultPageSize,
  rowCount,
}) => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: defaultPageSize,
    page: 0,
  });
  const apiRef = useGridApiRef();
  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'subtype',
      headerName: 'Sub Type',
      width: 150,
    },
    {
      field: 'workflow',
      headerName: 'Workflow',
      width: 250,
      renderCell: ({ row }) => {
        const { properties } = row;
        return properties?.templateName || properties?.workflowName;
      },
    },
    {
      field: 'entityName',
      headerName: 'Task / Action',
      width: 350,
    },
    {
      field: 'path',
      headerName: 'Detail',
      width: 300,
    },
    {
      field: 'ts',
      headerName: 'Event Date',
      width: 200,
      renderCell: ({ row }) => {
        const { ts } = row;
        const date = moment(ts);
        return date.format('MMM DD, YYYY @hh:mm a');
      },
    },
    {
      field: 'properties',
      headerName: 'Properties',
      width: 250,
      renderCell: ({ row }) => {
        const { properties } = row;
        return (
          <Tooltip
            placement="bottom"
            title={
              <PropertiesTooltipContainer>
                {Object.entries(properties).map(([key, value]) => (
                  <List key={key}>
                    <strong>{formatKey(key)}:</strong> {value}
                  </List>
                ))}
              </PropertiesTooltipContainer>
            }
          >
            <div>More Info... </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <DataGridPremium
      apiRef={apiRef}
      columns={columns}
      getRowId={(row) => row.eventIdentifier}
      rows={billingData}
      rowHeight={40}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          fontSize: '16px',
          fontWeight: '600',
        },
      }}
      columnHeaderHeight={50}
      showCellVerticalBorder
      showColumnVerticalBorder
      pagination
      pageSizeOptions={[defaultPageSize]}
      rowCount={rowCount}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={(newPaginationModel) => {
        setPaginationModel(newPaginationModel);
        onPaginationChange(
          newPaginationModel.page,
          newPaginationModel.pageSize,
        );
      }}
    />
  );
};

export default MeteringTable;
