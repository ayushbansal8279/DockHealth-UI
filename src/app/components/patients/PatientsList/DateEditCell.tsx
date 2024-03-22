import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import dayjs, { Dayjs } from 'dayjs';

import { Patient } from '@/app/types/Patient';

export default function DateEditCell(
  props: GridRenderEditCellParams<Patient, string | null>,
) {
  const { id, field, value } = props;
  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value) : null);
  const apiRef = useGridApiContext();

  const handleChange = (newValue: Dayjs | null) => {
    setDate(newValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue?.format('M/d/YYYY') ?? null,
    });
  };

  return (
    <DatePicker
      value={date}
      onChange={handleChange}
      slotProps={{ actionBar: { actions: ['clear'] } }}
    />
  );
}
