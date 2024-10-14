import { StyledDataGrid } from '../../Contacts/DataGridStyles'
import { useEffect, useState } from 'react';
import { getPatientImportStatus } from '@/app/api/patient-api';
import { Grid, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ImportStatusGrid = () => {

const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      try {
        const response = await getPatientImportStatus(); 
        setRows(response);
        console.log(response,'res')
      } catch (error) {
        console.error('Error fetching patient import status:', error);
      }
    };
    fetchDataAndRender();
  }, []);

  const defaultColumns = [
    {
      field: 'fileName', 
      headerName: 'FILE NAME',
      width: 300,
      renderCell: ({ row }) => (
          <Tooltip placement="top" title={row.fileName}>
              <span style={{
          display: 'inline-block',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{row.fileName}</span>
          </Tooltip>
         ),
      editable: false,
      
      
    },  
    {
      field: 'createdDateTime',
      headerName: 'IMPORT DATE/TIME',
      width: 210,
      renderCell: ({ row }) => {
        const date = new Date(row.createdDateTime);
        const formattedDate = date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', '');
    
        return (
          <Tooltip placement="top" title={formattedDate}>
            <span>{formattedDate}</span>
          </Tooltip>
        );
      },
      editable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'recordsToProcess',
      headerName: 'RECORDS TO PROCESS',
      width: 180,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.recordsToProcess}>
          <span>{row.recordsToProcess}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'recordsProcessed', 
      headerName: 'RECORDS PROCESSED',
      width: 180,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.recordsProcessed}>
          <span>{row.recordsProcessed}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'status', 
      headerName: 'STATUS',
      width: 150,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.completed ? 'Completed' : row.inError ? 'Error' : ''}>
          <span>{row.completed ? 'Completed' : row.inError ? 'Error' : ''}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'errorDetails', 
      headerName: 'ERROR DETAILS',
      width: 180,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.errorDetails}>
          <span>{row.errorDetails}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'center',
      headerAlign: 'center'
    }
  ];

  return (
    <Grid container xs={12} item justifyContent="center">
      <Grid item xs={12} xl={11} md={12} lg={11} >
          <DataGrid
            columns={defaultColumns}
            getRowId={(row) => row.identifier}
            rows={rows} 
            headerHeight={45}
            getRowHeight={() => '20px'}
            hideFooterSelectedRowCount={true}
            disableColumnMenu
            disableSelectionOnClick
            showColumnRightBorder
            showCellRightBorders
            sx={{
                
                '& .MuiDataGrid-columnHeaders': {
                  fontWeight: 'bold',
                },
              }}
          />
      </Grid>
    </Grid>
  );
};

export default ImportStatusGrid;
