import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import dayjs, { Dayjs } from 'dayjs';

export default function DateEditCell(
  props: GridRenderEditCellParams<any, string | null>,
) {
  const { id, field, value } = props;
  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value) : null);
  const apiRef = useGridApiContext();

  const handleChange = (newValue: Dayjs | null) => {
    setDate(newValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue?.format('MM/DD/YYYY') ?? null,
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
