import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import groupBy from 'ramda/src/groupBy';
import compose from 'ramda/src/compose';
import sortBy from 'ramda/src/sortBy';
import prop from 'ramda/src/prop';
import pick from 'ramda/src/pick';

import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import spacing from 'styles/spacing';
import { Category, CategoryLabel } from 'helpers/patient-details-helpers';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { getSortedCustomFields } from 'helpers/custom-fields-helpers';

import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';
import { ICustomField } from '@/app/types/CustomField';

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

  useEffect(() => {
    CustomFieldsApi.getAllPatientCustomFields(true).then((data) => {
      console.log('data', data);
      setCustomFields(getSortedCustomFields(data));
    });
  }, []);

  const handleSave = () => {
    onSave();
  };

  return (
    <ModalWrapper>
      <Stack sx={{ m: 2 }} spacing={3}>
        <Typography>
          Select the fields you would like to change, the changes will be saved:
        </Typography>
        <Stack>
          <Typography>Custom field</Typography>
          <Typography>Custom field</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Add field</Typography>
          <Stack
            spacing={1}
            flexGrow={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button variant="secondary-red" size="small" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary-red" size="small" onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ModalWrapper>
  );
}
