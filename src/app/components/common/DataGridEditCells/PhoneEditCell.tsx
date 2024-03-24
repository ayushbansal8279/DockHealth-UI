import React, { useRef } from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import { Patient } from '@/app/types/Patient';
import PhoneNumberInput from '../PhoneNumberInput/PhoneNumberInput';

type Props = GridRenderEditCellParams<Patient, string | null>;

export default function PhoneEditCell({ id, field, value, error }: Props) {
  const inputReference = useRef({});
  const apiRef = useGridApiContext();

  const handleChange = (newPhone: string) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newPhone,
    });
  };

  return (
    <PhoneNumberInput
      inputRef={inputReference}
      value={value || ''}
      error={error}
      onChange={handleChange}
    />
  );
}
