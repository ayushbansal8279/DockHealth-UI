import React from 'react';
import { useGridApiRef, DataGridPremium } from '@mui/x-data-grid-premium';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { List, PropertiesTooltipContainer } from './styled';
import moment from 'moment';
import { formatKey } from './helper';
import { Link } from '@mui/material';

const MeteringTable = ({ billingData }) => {
  const apiRef = useGridApiRef();
  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 200,
    },
    {
      field: 'subtype',
      headerName: 'Action',
      width: 250,
    },
    {
      field: 'entity',
      headerName: 'Entity',
      width: 100,
    },
    {
      field: 'entityName',
      headerName: 'Entity Name',
      width: 150,
    },
    {
      field: 'path',
      headerName: 'Detail',
      width: 300,
    },
    {
      field: 'ts',
      headerName: 'Event Date',
      width: 150,
      renderCell: ({ row }) => {
        const { ts } = row;
        const date = moment(ts);
        return date.format('MMM DD, YYYY');
      },
    },
    {
      field: 'entityIdentifier',
      headerName: 'Entity Identifier',
      width: 300,
    },
    {
      field: 'eventIdentifier',
      headerName: 'Event Identifier',
      width: 300,
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
      editMode="row"
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
    />
  );
};

export default MeteringTable;
