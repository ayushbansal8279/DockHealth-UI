import React, { useRef } from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

// @ts-ignore
import Input from '../Input/Input';
import { INameExtends } from '@/app/types/EditCell';
import { getFirstAndLastNameFromFullName } from '@/app/helpers/user-helper';

type Params = GridRenderEditCellParams<INameExtends, string>;

export const getFullName = (value: any, row: { firstName?: string; lastName?: string }) => {
  return `${row.lastName ?? ''}, ${row.firstName ?? ''}`;
};

export const setFullName = (value: string, row: any) => {
  const { firstName, lastName } = getFirstAndLastNameFromFullName(value);
  return {
    ...row,
    firstName: firstName ?? '',
    lastName: lastName ?? '',
  };
};

export const preProcessFullNameEditCellProps = ({ props }: Params) => {
  const { value } = props;
  const { firstName, lastName } = getFirstAndLastNameFromFullName(value);
  const error = !firstName || !lastName;
  return { ...props, error };
};

export default function FullNameEditCell({ id, error, field, value }: Params) {
  const apiRef = useGridApiContext();
  const ref = useRef(null);
  const errorMessage = error ? 'LastName, FirstName' : '';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
  };

  return (
    <Input
      ref={ref}
      label="Full Name"
      placeholder="LastName, FirstName"
      name={field}
      value={value}
      onChange={handleChange}
      required
      error={errorMessage}
      {...({} as any)}
    />
  );
}
