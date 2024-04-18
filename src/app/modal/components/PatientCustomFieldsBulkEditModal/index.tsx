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
  const [selectedIdxArr, setSelectedIdxArr] = useState<Array<number | null>>(
    [],
  );

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
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
    return difference([...Array(customFields.length).keys()], selectedIdxArr);
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

  const handleAddField = () => {
    setSelectedIdxArr((prev) => [...prev, null]);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // todo: api call
      reset();
      onSave();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <ModalWrapper>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Stack sx={{ m: 2 }} spacing={3}>
            <Typography>
              Select the fields you would like to change, the changes will be
              saved:
            </Typography>
            <Stack>
              <Typography>Custom field</Typography>
              <Typography>Custom field</Typography>
            </Stack>
            <Stack direction="row">
              <Button
                variant="text"
                startIcon={<AddBoxIcon />}
                onClick={handleAddField}
              >
                Add Field
              </Button>
              <Stack
                spacing={1}
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button
                  variant="secondary-red"
                  size="small"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button variant="primary-red" size="small" onClick={handleSave}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </ModalWrapper>
  );
}
