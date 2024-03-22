import React from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

import { Stack, TextField } from '@mui/material';
import { Patient } from '@/app/types/Patient';

export default function NameEditCell(props: GridRenderEditCellParams<Patient>) {
  const { id, row } = props;
  const apiRef = useGridApiContext();

  const handleChange =
    (field: 'firstName' | 'lastName' | 'middleName') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      });
    };

  return (
    <Stack gap={1} sx={{ px: 2 }}>
      <TextField
        label="First Name"
        name="firstName"
        variant="filled"
        value={row.firstName}
        onChange={handleChange('firstName')}
        required
      />
      <TextField
        label="Middle Name"
        name="middleName"
        variant="filled"
        value={row.middleName}
        onChange={handleChange('middleName')}
      />
      <TextField
        label="Last Name"
        name="lastName"
        variant="filled"
        value={row.lastName}
        onChange={handleChange('lastName')}
        required
      />
    </Stack>
  );
}
