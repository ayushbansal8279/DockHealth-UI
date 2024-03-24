import React, { useRef } from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import PhoneNumberInput from '../PhoneNumberInput/PhoneNumberInput';
import { isValidPhoneNumber } from '@/app/helpers/validation-helper';

type Params = GridRenderEditCellParams<Record<string, any>, string | null>;

export const preProcessPhoneEditCellProps = (params: Params) => {
  const error = isValidPhoneNumber(params.props.value)
    ? ''
    : 'Invalid Phone Number';
  return { ...params.props, error };
};

export default function PhoneEditCell({ id, field, value, error }: Params) {
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
