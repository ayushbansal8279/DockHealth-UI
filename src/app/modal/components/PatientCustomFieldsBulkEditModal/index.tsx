import * as Yup from 'yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import difference from 'ramda/src/difference';
import { yupResolver } from '@hookform/resolvers/yup';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Button from 'components/common/Button/Button';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { bulkEditPatientsCustomFields } from '@/app/api/patients-api.js';

import { ICustomField } from '@/app/types/CustomField';
import { FormProvider, useForm } from 'react-hook-form';
import FormFieldItem from './FormFieldItem';
import { formatMetaData } from './helpers';

interface Props {
  patientIdentifiers: string[];
  onSave: VoidFunction;
  closeModal: VoidFunction;
}

export default function PatientCustomFieldsBulkEditModal({
  patientIdentifiers,
  onSave,
  closeModal,
}: Props) {
  const dispatch = useDispatch();

  const [customFields, setCustomFields] = useState<ICustomField[] | null>(null);
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

  useEffect(() => {
    CustomFieldsApi.getAllPatientCustomFields(true).then(
      (data: ICustomField[]) => {
        setCustomFields(data.sort((a, b) => a.sortIndex - b.sortIndex));
      },
    );
  }, []);

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
      const formattedMetaData = formatMetaData(getValues('metaData'));
      if (!formattedMetaData) {
        return;
      }
      const payload = {
        metaData: formattedMetaData,
        patientIdentifiers,
      };
      await bulkEditPatientsCustomFields(payload);
      reset();
      onSave();
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
            <Box>
              <Button
                variant="text"
                startIcon={<AddBoxIcon />}
                onClick={handleAddField}
              >
                Add Field
              </Button>
            </Box>
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button variant="secondary" size="small" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={saveDisabled}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
