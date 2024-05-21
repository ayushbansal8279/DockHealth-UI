import * as Yup from 'yup';
import React, { useState, useRef } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { ICustomField } from '@/app/types/CustomField';
import { FormProvider, useForm } from 'react-hook-form';
import FormFieldItem from './FormFieldItem';
import { FormattedMetaDataForApi, formatMetaDataForApi } from './helpers';
import RotatableChevron from '@/app/components/common/RotatableChevron/RotatableChevron';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  ConfirmButton as SaveButton,
  CancelButton,
} from '../ModalButton/ModalButtons';
import {
  FilterButtonWrapper,
  ClearFilter,
  BoxContainer,
  AddFilterButtonContainer,
  AddFilterRotatableChevronButtonWrapper,
  AddFilterRotatableChevronButtonLabel,
  AddFilterButtonLabel,
} from '@/app/components/filter/NewFilterContainer/styled';
import useBoolean from '@/app/hooks/useBoolean';
import palette from '@/app/styles/palette';
import FilterOptionsPopover from '@/app/components/filter/NewFilterContainer/FilterOptionsPopover';

interface Props {
  customFields: ICustomField[];
  onSave: (formattedMetaData: FormattedMetaDataForApi) => Promise<void>;
  closeModal: VoidFunction;
}

export default function BulkEditCustomFieldsModal({
  customFields,
  onSave,
  closeModal,
}: Props) {
  const popoverReference = useRef(null);
  const [isAddFieldPopoverOpen, openAddFieldPopover, closeAddFieldPopover] =
    useBoolean(false);
  const [selectedIdentifierArr, setSelectedIdentifierArr] = useState<
    Array<string>
  >([]);

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

  const actionsHidden =
    isSubmitting || !Object.keys(getValues('metaData') ?? {}).length;

  const handleRemove = (customFieldIdentifier: string) => () => {
    const idx = selectedIdentifierArr.indexOf(customFieldIdentifier);
    if (idx >= 0) {
      setSelectedIdentifierArr((prev) => [
        ...prev.slice(0, idx),
        ...prev.slice(idx + 1),
      ]);
    }
  };

  const handleAddField = (customFieldIdentifier: string) => {
    if (!selectedIdentifierArr.includes(customFieldIdentifier)) {
      setSelectedIdentifierArr((prev) => [...prev, customFieldIdentifier]);
    }
    closeAddFieldPopover();
  };

  const clearFilter = () => {
    setSelectedIdentifierArr([]);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedMetaData = formatMetaDataForApi(data.metaData);
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
          <Stack sx={{ mb: 2 }} spacing={2}>
            {!!customFields &&
              selectedIdentifierArr.map((identifier) => (
                <FormFieldItem
                  key={identifier}
                  customFields={customFields}
                  identifier={identifier}
                  onRemove={handleRemove(identifier)}
                />
              ))}
          </Stack>
          <FilterButtonWrapper>
            <BoxContainer ref={popoverReference}>
              <AddFilterButtonContainer
                variant="text"
                onClick={openAddFieldPopover}
                size="large"
              >
                <FilterListIcon fontSize="medium" />
                <AddFilterButtonLabel variant="body1" component="span">
                  Add Field
                </AddFilterButtonLabel>
              </AddFilterButtonContainer>
              <Box display="flex" width="3px">
                <AddFilterRotatableChevronButtonWrapper
                  variant="text"
                  onClick={openAddFieldPopover}
                  size="large"
                >
                  <AddFilterRotatableChevronButtonLabel variant="body1">
                    <RotatableChevron
                      rotated={isAddFieldPopoverOpen}
                      color={palette.white}
                    />
                  </AddFilterRotatableChevronButtonLabel>
                </AddFilterRotatableChevronButtonWrapper>
              </Box>
            </BoxContainer>
            <FilterOptionsPopover
              anchorEl={popoverReference.current}
              open={isAddFieldPopoverOpen}
              onClose={closeAddFieldPopover}
              filterOptionsList={customFields}
              onFilterSelect={handleAddField}
              idField="identifier"
              labelField="name"
              popoverZindex={5000}
            />
            {selectedIdentifierArr.length > 0 && (
              <ClearFilter onClick={clearFilter}>Clear Fields</ClearFilter>
            )}
          </FilterButtonWrapper>
          {!actionsHidden && (
            <>
              <Divider />
              <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                <CancelButton fullWidth onClick={closeModal}>
                  Cancel
                </CancelButton>
                <SaveButton
                  fullWidth
                  type="submit"
                  loading={isSubmitting}
                  loadingIndicator="Saving..."
                >
                  Save
                </SaveButton>
              </Stack>
            </>
          )}
        </form>
      </FormProvider>
    </Box>
  );
}
