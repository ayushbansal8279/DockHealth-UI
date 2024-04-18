import { ICustomField } from '@/app/types/CustomField';
import { Stack } from '@mui/material';
import React from 'react';

interface Props {
  customFields: ICustomField[];
  selectedIdx: number | null;
  availableIdxArr: Array<number | null>;
}

export default function FormFieldItem({
  customFields,
  selectedIdx,
  availableIdxArr,
}: Props) {
  const renderFieldSelector = null;
  return <Stack direction="row" spacing={2}></Stack>;
}
