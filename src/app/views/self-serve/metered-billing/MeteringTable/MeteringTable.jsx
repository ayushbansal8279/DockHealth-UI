import React from 'react';
import { useGridApiRef, DataGridPremium } from '@mui/x-data-grid-premium';
import { dummyMeteringData } from './helper';
import { Link } from '@mui/material';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { Left, PropertiesTooltipContainer } from './styled';
import moment from 'moment';

const MeteringTable = () => {
  const apiRef = useGridApiRef();
  const columns = [
    {
      field: 'topic',
      headerName: 'Topic',
      width: 250,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'typeIdentifier',
      headerName: 'Type Identifier',
      width: 250,
    },
    {
      field: 'path',
      headerName: 'Path',
      width: 150,
      renderCell: ({ row }) => {
        const { path } = row;
        return (
          <Link href="https://www.google.co.in/" underline="hover">
            {path}
          </Link>
        );
      },
    },
    {
      field: 'eventDate',
      headerName: 'Event Date',
      width: 250,
      renderCell: ({ row }) => {
        const { eventDate } = row;
        const date = moment(eventDate);
        return date.format('MMM DD, YYYY');
      },
    },
    {
      field: 'properties',
      headerName: 'Properties',
      width: 250,
      renderCell: ({ row }) => {
        const { properties } = row;
                
        // This is just for display puspose This is gonna change with actual data of properties
        return (
          <Tooltip
            placement="bottom"
            title={
              <PropertiesTooltipContainer>
                <h4>Properties</h4>
                <div>
                  <Left pl={10}>{`Property 1 : {`}</Left>
                  <Left pl={30}>{`id:  “12345678” , `}</Left>
                  <Left pl={30}>{`type:  “File”, `}</Left>
                  <Left pl={30}>{`menuitem: [`}</Left>
                  <Left pl={50}>{`{name: “New”, type: “API”},`}</Left>
                  <Left pl={50}>{`{name: “Open”, type: “Filter”},`}</Left>
                  <Left pl={50}>{`{name: “Close”, type: “Filter”},`}</Left>
                  <Left pl={30}>{` ]`}</Left>
                  <Left pl={10}>{` }`}</Left>
                </div>
              </PropertiesTooltipContainer>
            }
          >
            <div>Name : New &nbsp; &nbsp; type : API</div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <DataGridPremium
      apiRef={apiRef}
      columns={columns}
      getRowId={(row) => row.typeIdentifier}
      editMode="row"
      rows={dummyMeteringData}
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
