import * as Yup from 'yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import groupBy from 'ramda/src/groupBy';
import compose from 'ramda/src/compose';
import sortBy from 'ramda/src/sortBy';
import prop from 'ramda/src/prop';
import pick from 'ramda/src/pick';
import difference from 'ramda/src/difference';
import { yupResolver } from '@hookform/resolvers/yup';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import spacing from 'styles/spacing';
import { Category, CategoryLabel } from 'helpers/patient-details-helpers';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { getSortedCategorizedCustomFields } from 'helpers/custom-fields-helpers';

import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';
import { ICustomField, ICategoriedCustomFields } from '@/app/types/CustomField';
import { FormProvider, useForm } from 'react-hook-form';
import FormFieldItem from './FormFieldItem';

interface Props {
  closeModal: VoidFunction;
  onSave: VoidFunction;
}

export default function PatientCustomFieldsBulkEditModal({
  closeModal,
  onSave,
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
      patientMetadata: [],
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

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
  console.log('customFields', customFields);

  const handleSave = () => {
    onSave();
  };

  const handleChangeSelectedIdx = (
    selectedIdxArrIdx: number,
    selectedIdx: number,
  ) => {
    console.log('selectedIdx', selectedIdx);
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
      // todo: api call
      console.log('data', data.patientMetadata);
      // reset();
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
              <Button variant="secondary-red" size="small" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary-red" size="small" type="submit">
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
