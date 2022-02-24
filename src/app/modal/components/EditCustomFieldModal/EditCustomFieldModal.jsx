/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { string, object, array } from 'yup';
import { partial } from 'ramda';
import { Box, Grid, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { FieldType, FIELD_TYPE_OPTIONS } from 'helpers/field-type-helpers';
import { CATEGORY_OPTIONS, Category } from 'helpers/patient-details-helpers';
import FormInput from 'components/common/Input/FormInput';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import Checkbox from 'components/common/Checkbox/Checkbox';
import FiledTypeStep from './FieldTypeStep';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  FieldForm,
  FormScrollingContainer,
  InfoText,
} from './styled';
import AdditionalOptions from './AdditionalOptions';

const REQUIRED_MESSAGE = 'This field is required';

const EditCustomFieldModal = ({
  closeModal,
  customField,
  onAdded,
  onUpdated,
  options: { type },
  taskListIdentifier,
}) => {
  const [additionalOptionsState, setAdditionalOptionsState] = useState({
    PATIENT_HEADER: false,
    LIST_HEADER: false,
    SEARCHING: false,
  });

  // TODO: Add apply initial data when will be available

  const ADDITIONAL_OPTIONS = [
    {
      label: 'Display on patient header',
      key: 'PATIENT_HEADER',
      value: additionalOptionsState?.PATIENT_HEADER,
      onChange: value =>
        setAdditionalOptionsState(s => ({
          ...s,
          PATIENT_HEADER: value || false,
        })),
    },
    {
      label: 'Display on patient list header',
      key: 'LIST_HEADER',
      value: additionalOptionsState?.LIST_HEADER,
      onChange: value =>
        setAdditionalOptionsState(s => ({
          ...s,
          LIST_HEADER: value || false,
        })),
    },
    {
      label: 'Take into account while searching',
      key: 'SEARCHING',
      value: additionalOptionsState?.SEARCHING,
      onChange: value =>
        setAdditionalOptionsState(s => ({
          ...s,
          SEARCHING: value || false,
        })),
    },
  ];

  const addOptionButtonReference = useRef(null);
  const isCreatingNewField = !customField;
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const additionalOptionsEnabled = type === 'PATIENT';

  const validationSchema = useMemo(() => {
    return object().shape({
      name: string().required(REQUIRED_MESSAGE),
      placeholder: string().nullable(),
      fieldType: string().required(REQUIRED_MESSAGE),
      options: array()
        .of(
          object().shape({
            name: string().required(REQUIRED_MESSAGE),
          }),
        )
        .nullable(),
      ...(type === 'TASK'
        ? {}
        : { fieldCategoryType: string().required(REQUIRED_MESSAGE) }),
    });
  }, [type]);

  const formMethods = useForm({
    validationSchema,
    mode: 'onSubmit',
    defaultValues: isCreatingNewField
      ? { fieldCategoryType: Category.OTHER_INFO }
      : customField,
  });
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    watch,
    errors,
  } = formMethods;

  useEffect(() => {
    register('fieldType');
    register('options');

    return () => {
      unregister('fieldType');
      unregister('options');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieldTypeValue = watch('fieldType');
  const optionsValue = watch('options');
  const numberOfOptions = optionsValue?.length;

  useEffect(() => {
    if (numberOfOptions) {
      addOptionButtonReference.current.scrollIntoView(false);
    }
  }, [numberOfOptions]);

  useEffect(() => {
    if (isCreatingNewField) {
      if (fieldTypeValue === FieldType.DROPDOWN) {
        setValue('options', [
          {
            identifier: optionsValue?.length || 0,
            name: '',
          },
        ]);
      } else {
        setValue('options', null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldTypeValue]);

  const handleOptionValueChange = (optionId, event) => {
    setValue(
      'options',
      optionsValue.map(o =>
        o.identifier === optionId ? { ...o, name: event.target.value } : o,
      ),
    );
  };

  const handleAddOption = () => {
    setValue('options', [
      ...optionsValue,
      { identifier: optionsValue.length, name: '' },
    ]);
  };

  const handleRemoveOption = optionId => {
    setValue(
      'options',
      optionsValue.filter(({ identifier }) => identifier !== optionId),
    );
  };

  const handleEditSubmit = data => {
    setIsSaving(true);
    const updatedField = { ...customField, ...data, ...additionalOptionsState };
    CustomFieldsApi.updateCustomField(updatedField, type, taskListIdentifier)
      .then(() => {
        onUpdated(updatedField);
        setIsSaving(false);
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        setIsSaving(false);
      });
  };

  const handleAddSubmit = data => {
    setIsSaving(true);
    CustomFieldsApi.addCustomField(
      { ...data, ...additionalOptionsState },
      type,
      taskListIdentifier,
    )
      .then(addedField => {
        onAdded(addedField);
        setIsSaving(false);
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        setIsSaving(false);
      });
  };

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{isCreatingNewField ? 'Add' : 'Edit'} custom field</Title>
      <Box m={2} />
      <Box display="flex" flex={1} width="100%">
        {!fieldTypeValue ? (
          <FiledTypeStep onSelect={partial(setValue, ['fieldType'])} />
        ) : (
          <FormContext {...formMethods}>
            <FieldForm
              onSubmit={handleSubmit(
                customField?.identifier ? handleEditSubmit : handleAddSubmit,
              )}
            >
              <FormScrollingContainer>
                <Box overflow="hidden">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormInput
                        required
                        autoFocus
                        name="name"
                        label="Field label name"
                      />
                    </Grid>
                    {fieldTypeValue !== FieldType.DATE && (
                      <Grid item xs={12}>
                        <FormInput
                          name="placeholder"
                          label="Field label placeholder"
                        />
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <FormSelect
                        readOnly={!!customField}
                        required
                        label="Field type"
                        name="fieldType"
                        options={FIELD_TYPE_OPTIONS}
                      />
                    </Grid>
                    {type !== 'TASK' && (
                      <Grid item xs={6}>
                        <FormSelect
                          required
                          label="Category"
                          name="fieldCategoryType"
                          options={CATEGORY_OPTIONS}
                        />
                      </Grid>
                    )}

                    {optionsValue?.length > 0 && (
                      <>
                        <Box m={2} />
                        <Grid item xs={12}>
                          <InfoText>Dropdown options</InfoText>
                        </Grid>
                        {optionsValue.map(({ identifier, name }, index) => (
                          <Grid key={identifier} item xs={12}>
                            <Input
                              required
                              label={`Option ${index + 1}`}
                              name={`options[${identifier}]`}
                              value={name}
                              onChange={partial(handleOptionValueChange, [
                                identifier,
                              ])}
                              error={errors?.options?.[index]?.name?.message}
                              endAdornment={
                                optionsValue.length > 1 ? (
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleRemoveOption(identifier)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                ) : null
                              }
                            />
                          </Grid>
                        ))}
                        <Button
                          reference={addOptionButtonReference}
                          variant="text"
                          width="auto"
                          onClick={handleAddOption}
                        >
                          <span style={{ color: 'orange' }}>+</span> Add option
                        </Button>
                      </>
                    )}
                  </Grid>
                  {additionalOptionsEnabled && (
                    <Box m={2}>
                      <AdditionalOptions options={ADDITIONAL_OPTIONS} />
                    </Box>
                  )}
                </Box>
              </FormScrollingContainer>
              <Box m={2} />
              <Grid container justify="flex-end">
                <Button width="auto" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Box m={1} />
                <Button type="submit" width="auto" disabled={isSaving}>
                  Save custom field
                </Button>
              </Grid>
            </FieldForm>
          </FormContext>
        )}
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditCustomFieldModal;
