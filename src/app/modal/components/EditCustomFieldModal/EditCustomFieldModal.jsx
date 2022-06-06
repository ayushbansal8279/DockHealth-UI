/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { string, object, array } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
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
import { getAdditionalOptions } from './helpers';

const REQUIRED_MESSAGE = 'This field is required';

const EditCustomFieldModal = ({
  closeModal,
  customField,
  onAdded,
  onUpdated,
  options: { type },
  taskListIdentifier,
}) => {
  const [displayOptionsState, setDisplayOptionsState] = useState({
    displayOptions: customField?.displayOptions || [],
  });

  const handleDisplayOptionChange = useCallback(
    (value, displayOption) => {
      let updatedOptions = displayOptionsState?.displayOptions;
      if (value) {
        if (!updatedOptions?.includes(displayOption)) {
          updatedOptions.push(displayOption);
        }
      } else {
        updatedOptions = updatedOptions.filter(item => item !== displayOption);
      }
      setDisplayOptionsState(s => ({
        ...s,
        displayOptions: updatedOptions,
      }));
    },
    [displayOptionsState],
  );

  const ADDITIONAL_OPTIONS = useMemo(
    () =>
      getAdditionalOptions({
        type,
        displayOptionsState,
        handleDisplayOptionChange,
      }),
    [displayOptionsState, handleDisplayOptionChange, type],
  );

  const addOptionButtonReference = useRef(null);
  const isCreatingNewField = !customField;
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

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
    resolver: yupResolver(validationSchema),
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
      if (
        fieldTypeValue === FieldType.DROPDOWN ||
        fieldTypeValue === FieldType.DROPDOWN_MULTI
      ) {
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

  const handleOptionColorChange = (optionId, event) => {
    setValue(
      'options',
      optionsValue.map(o =>
        o.identifier === optionId ? { ...o, color: event.target.value } : o,
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
    const updatedField = {
      ...customField,
      ...data,
      ...displayOptionsState,
    };
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
      { ...data, ...displayOptionsState },
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
          <FormProvider {...formMethods}>
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
                    {type !== 'TASK' && type !== 'PROVIDER' && (
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
                        {optionsValue.map((option, index) => {
                          const { identifier, name, color } = option;
                          return (
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
                              <Box m={2} />
                              <ColorPicker
                                name={`selectOptionColor[${identifier}]`}
                                value={color}
                                onChange={partial(handleOptionColorChange, [
                                  identifier,
                                ])}
                              />
                            </Grid>
                          );
                        })}
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
                  {ADDITIONAL_OPTIONS?.length > 0 && (
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
          </FormProvider>
        )}
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditCustomFieldModal;
