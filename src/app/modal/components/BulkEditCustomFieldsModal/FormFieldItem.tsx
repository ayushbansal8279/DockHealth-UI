import React, { useMemo } from 'react';
import { ICustomField } from '@/app/types/CustomField';
import { IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomField from '@/app/components/common/CustomField/CustomField';

interface Props {
  customFields: ICustomField[];
  identifier: string;
  onRemove: () => void;
}

export default function FormFieldItem({
  customFields,
  identifier,
  onRemove,
}: Props) {
  const customField = useMemo(() => {
    return customFields.find((cf) => cf.identifier === identifier);
  }, [customFields, identifier]);

  if (!customField) {
    console.error(`Custom Field not found: ${identifier}`);
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box flexGrow={1}>
        <CustomField
          readOnly={false}
          field={customField}
          fieldsGroupKey="metaData"
          popoverZindex={5000}
        />
      </Box>
      <IconButton aria-label="delete" onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
