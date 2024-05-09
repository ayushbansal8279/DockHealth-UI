import * as Yup from 'yup';
import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import difference from 'ramda/src/difference';
import { yupResolver } from '@hookform/resolvers/yup';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ICustomField } from '@/app/types/CustomField';
import { FormProvider, useForm } from 'react-hook-form';
import FormFieldItem from './FormFieldItem';
import { FormattedMetaData, formatMetaData } from './helpers';

interface Props {
  customFields: ICustomField[];
  onSave: (formattedMetaData: FormattedMetaData) => Promise<void>;
  closeModal: VoidFunction;
}

export default function CustomFieldsBulkEditModal({
  customFields,
  onSave,
  closeModal,
}: Props) {
  const [selectedIdxArr, setSelectedIdxArr] = useState<Array<number>>([]);

  // NOTE: Used for key/selectedIdx for field without selected customField
  // every time new empty customField added, this is decremented to keep identical key
  const [emptyIdxIndicator, setEmptyIdxIndicator] = useState(-1);

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {
      metaData: {},
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  console.log('customFields', customFields);

  const saveDisabled =
    isSubmitting || !Object.keys(getValues('metaData')).length;

  const availableIdxArr = useMemo(() => {
    if (!customFields) {
      return [];
    }
    return difference(
      [...Array(customFields.length).keys()],
      selectedIdxArr,
    ) as number[];
  }, [customFields, selectedIdxArr]);

  const handleChangeSelectedIdx = (
    selectedIdxArrIdx: number,
    selectedIdx: number,
  ) => {
    setSelectedIdxArr((prev) => [
      ...prev.slice(0, selectedIdxArrIdx),
      selectedIdx,
      ...prev.slice(selectedIdxArrIdx + 1),
    ]);
  };

  const handleRemove = (selectedIdxArrIdx: number) => {
    setSelectedIdxArr((prev) => [
      ...prev.slice(0, selectedIdxArrIdx),
      ...prev.slice(selectedIdxArrIdx + 1),
    ]);
  };

  const handleAddField = () => {
    setSelectedIdxArr((prev) => [...prev, emptyIdxIndicator]);
    setEmptyIdxIndicator((prev) => prev - 1);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedMetaData = formatMetaData(data.metaData);
      if (!formattedMetaData) {
        return;
      }

      await onSave(formattedMetaData);
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Box
      sx={{ width: '700px', maxWidth: '100vw', backgroundColor: 'white', p: 2 }}
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Typography color="GrayText" sx={{ mb: 2 }}>
            Select the fields you would like to change, the changes will be
            saved:
          </Typography>
          <Stack sx={{ mb: 2 }}>
            {!!customFields &&
              selectedIdxArr.map((selectedIdx, idx) => (
                <FormFieldItem
                  key={selectedIdx}
                  customFields={customFields}
                  selectedIdx={selectedIdx}
                  availableIdxArr={availableIdxArr}
                  onChangeSelectedIdx={(selectedIdx: number) =>
                    handleChangeSelectedIdx(idx, selectedIdx)
                  }
                  onRemove={() => handleRemove(idx)}
                />
              ))}
          </Stack>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              startIcon={<AddBoxIcon />}
              onClick={handleAddField}
            >
              Add Field
            </Button>
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button variant="outlined" size="small" onClick={closeModal}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                size="small"
                type="submit"
                disabled={saveDisabled}
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </Stack>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
