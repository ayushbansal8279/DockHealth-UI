import React, { useMemo } from 'react';
import { ICustomField } from '@/app/types/CustomField';
import { Input, Stack, IconButton, Grid, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Select from 'components/common/Select/Select';
import CustomField from '@/app/components/common/CustomField/CustomField';

interface Props {
  customFields: ICustomField[];
  selectedIdx: number; // available only when >= 0
  availableIdxArr: Array<number>;
  onChangeSelectedIdx: (v: number) => void;
  onRemove: () => void;
}

export default function FormFieldItem({
  customFields,
  selectedIdx,
  availableIdxArr,
  onChangeSelectedIdx,
  onRemove,
}: Props) {
  const availableCustomFieldOptions = useMemo(() => {
    const idxArr = selectedIdx >= 0 ? [selectedIdx] : [];

    return [...idxArr, ...availableIdxArr].map((idx) => ({
      label: customFields[idx].name,
      value: idx,
    }));
  }, [customFields, selectedIdx, availableIdxArr]);

  const handleSelectedCustomFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChangeSelectedIdx(Number(event.target.value));
  };

  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={5}>
        <Select
          label="Choose field"
          options={availableCustomFieldOptions}
          value={selectedIdx}
          onChange={handleSelectedCustomFieldChange}
        />
      </Grid>
      <Grid item xs={7} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box flexGrow={1}>
          {selectedIdx >= 0 && (
            <CustomField
              readOnly={false}
              field={customFields[selectedIdx]}
              fieldsGroupKey="patientMetadata"
              popoverZindex={5000}
            />
          )}
        </Box>
        <IconButton aria-label="delete" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
