import React from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import TaskItemDate from '@/app/components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemDate';
import { calculateDateTimeIntent } from '@/app/helpers/date-intent-helpers';

export default function CustomDateEditCell(
  props: GridRenderEditCellParams<any, string | null>,
) {
  const { id, field, value, readOnly=false } = props;
  const apiRef = useGridApiContext();

  const handleDateChange = (newDate: any) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newDate,
    });
  };

  return (
    <TaskItemDate
      value={value}
      onChange={handleDateChange}
      readOnly={readOnly}
      dateTimeIntent={calculateDateTimeIntent(value)}
    />
  );
}