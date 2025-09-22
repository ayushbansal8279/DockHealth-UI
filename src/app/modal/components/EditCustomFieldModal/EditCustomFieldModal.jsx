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
import partial from 'ramda/src/partial';
import { Box, Dialog, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as CustomFieldsApi from 'api/custom-fields-api';
import {
  FieldType,
  FIELD_TYPE_OPTIONS,
  REGEX_OPTIONS,
  DisplayOption,
} from 'helpers/field-type-helpers';
import { CATEGORY_OPTIONS, Category } from 'helpers/patient-details-helpers';
import { CATEGORY_OPTIONS as TASK_CATEGORY_OPTIONS } from 'helpers/task-details-helpers';
import FormInput from 'components/common/Input/FormInput';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import { getAllProfileTypes } from 'api/profile-type-api';
import { ORGANIZATION_TILE_COLORS } from 'styles/organization-tile-colors';
import * as ProfileTypeFieldsApi from 'api/profile-type-field-api';
import { getAllTaskListCustomFields } from 'api/custom-fields-api';
import { sortAlphabetical } from 'helpers/custom-fields-helpers';
import FiledTypeStep from './FieldTypeStep';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  FieldForm,
  FormScrollingContainer,
  InfoText,
  ErrorMessage,
} from './styled';
import AdditionalOptions from './AdditionalOptions';
import { getAdditionalOptions, regexValidator } from './helpers';
import {
  SelectOptionColor,
  SelectParentDropdown,
  SelectParentOption,
} from '../../customModals/styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import ImportDataModal from '../ImportDataModal/ImportDataModal';
import {
  downloadCustomFieldImportTemplate,
  uploadCustomFieldOptions,
} from '@/app/api/custom-fields-api';
import { showGlobalAlert } from '@/app/alert/actions';

const REQUIRED_MESSAGE = 'This field is required';

const filterAdditionalOptionsByFieldType = (
  additionalOptions,
  fieldTypeValue,
) => {
  return additionalOptions.filter((option) => {
    if (option.key !== DisplayOption.SINGLE_SELECT) return true;
    return fieldTypeValue === FieldType.RELATIONSHIP;
  });
};

const EditCustomFieldModal = ({
  closeModal,
  customField,
  onAdded,
  onUpdated,
  options: { type },
  taskListIdentifier,
  profileTypeIdentifier,
  fetchUserCustomFields,
  fieldCategoryDisabled = false,
}) => {
  const [displayOptionsState, setDisplayOptionsState] = useState({
    displayOptions: customField?.displayOptions || [],
  });

  const handleDisplayOptionChange = useCallback(
    (value, displayOption) => {
      let updatedOptions = displayOptionsState?.displayOptions || [];

      if (value) {
        const isRequired = displayOption.endsWith('_REQUIRED');
        if (displayOption === 'READONLY' || displayOption === 'HIDDEN') {
          updatedOptions = updatedOptions.filter(
            (item) => !item.endsWith('_REQUIRED'),
          );
        }
        if (isRequired) {
          updatedOptions = updatedOptions.filter(
            (item) => item !== 'READONLY' && item !== 'HIDDEN',
          );
        }
        if (!updatedOptions.includes(displayOption)) {
          updatedOptions.push(displayOption);
        }
      } else {
        updatedOptions = updatedOptions.filter(
          (item) => item !== displayOption,
        );
      }
      setDisplayOptionsState((s) => ({
        ...s,
        displayOptions: updatedOptions,
      }));
    },
    [displayOptionsState],
  );

  const availableAdditionalOptions = useMemo(
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
      validationRegex: regexValidator(),
      options: array()
        .of(
          object().shape({
            name: string()
              .required(REQUIRED_MESSAGE)
              .max(255, 'Option name must be at most 255 characters'),
          }),
        )
        .nullable(),

      ...(type === 'PROFILE'
        ? {}
        : { fieldCategoryType: string().required(REQUIRED_MESSAGE) }),
    });
  }, [type]);

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: useMemo(() => {
      const baseCustomField = isCreatingNewField
        ? {
            fieldCategoryType: type === 'PATIENT' ? Category.OTHER_INFO : '',
          }
        : {
            ...customField,
            relatedProfileType: customField.relatedProfileType?.identifier,
          };
      if (customField?.relatedProfileType) {
        const {
          relatedProfileType: { identifier: value },
        } = customField;

        return { ...baseCustomField, relatedProfileType: value };
      }
      return baseCustomField;
    }, [customField, isCreatingNewField, type]),
  });
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const [customFields, setCustomFields] = useState([]);
  const [importPopupOpen, setImportPopupOpen] = useState(false);

  useEffect(() => {
    getAllTaskListCustomFields(taskListIdentifier ? 'ALL' : null).then(
      (response) => {
        setCustomFields(
          sortAlphabetical(
            response.filter((item) => item.fieldType === 'PICK_LIST'),
          ),
        );
      },
    );
  }, [taskListIdentifier]);

  useEffect(() => {
    register('fieldType');
    register('options');

    return () => {
      unregister('fieldType');
      unregister('options');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieldNameValue = watch('name');
  const fieldTypeValue = watch('fieldType');
  const optionsValue = watch('options');
  const numberOfOptions = optionsValue?.length;

  const filteredAdditionalOptions = useMemo(
    () =>
      filterAdditionalOptionsByFieldType(
        availableAdditionalOptions,
        fieldTypeValue,
      ),
    [availableAdditionalOptions, fieldTypeValue],
  );

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
        setValue(
          'options',
          [
            {
              identifier: optionsValue?.length || 0,
              name: '',
            },
          ],
          { shouldValidate: false },
        );
      } else {
        setValue('options', null, { shouldValidate: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldTypeValue]);

  // eslint-disable-next-line unicorn/consistent-function-scoping,sonarjs/no-identical-functions
  const handleOptionColorChange = (optionId) => (event) => {
    setValue(
      'options',
      optionsValue.map((o) =>
        o.identifier === optionId ? { ...o, color: event.target.value } : o,
      ),
    );
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleParentDropdownChange = (optionId) => (event) => {
    setValue(
      'options',
      optionsValue.map((o) =>
        o.identifier === optionId
          ? { ...o, linkedCustomFieldIdentifier: event.target.value }
          : o,
      ),
    );
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleParentOptionChange = (optionId) => (event) => {
    setValue(
      'options',
      // eslint-disable-next-line sonarjs/no-identical-functions
      optionsValue.map((o) =>
        o.identifier === optionId
          ? { ...o, linkedCustomFieldOptionIdentifier: event.target.value }
          : o,
      ),
    );
  };

  const handleAddOption = () => {
    setValue('options', [
      ...optionsValue,
      { identifier: optionsValue.length, name: '' },
    ]);
  };

  const handleRemoveOption = (optionId) => {
    setValue(
      'options',
      optionsValue.filter(({ identifier }) => identifier !== optionId),
    );
  };

  const [profileTypeOptions, setProfileTypeOptions] = useState([]);
  const [selectedProfileType, setSelectedProfileType] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allProfileTypes, predefinedProfileTypes] = await Promise.all([
          getAllProfileTypes(),
          getAllProfileTypes('PREDEFINED'),
        ]);

        const combinedProfileTypes = [
          ...allProfileTypes,
          ...predefinedProfileTypes,
        ];

        const sortedProfileTypes = combinedProfileTypes.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        const profileTypeOptions = sortedProfileTypes.map(
          ({ identifier, name }) => ({
            label: name,
            value: identifier,
          }),
        );

        setProfileTypeOptions(profileTypeOptions);
      } catch (err) {
        console.error('Error fetching profile types:', err);
      }
    }

    fetchData();
  }, []);

  const handleEditSubmit = (data) => {
    setIsSaving(true);
    if (type === 'PROFILE') {
      const updatedField = {
        contextType: 'CUSTOM',
        ...data,
        ...displayOptionsState,
        fieldCategoryType: 'PROFILE',
        relatedProfileType: {
          identifier: data.relatedProfileType,
        },
        profileType: {
          identifier: profileTypeIdentifier,
        },
      };

      delete updatedField.updatedDateTime;
      delete updatedField.active;
      delete updatedField.createdDateTime;
      delete updatedField.identifier;
      delete updatedField.sortIndex;
      delete updatedField.validationRegexSelector;

      ProfileTypeFieldsApi.editProfileFieldType(data.identifier, updatedField)
        .then(() => {
          onUpdated({
            ...updatedField,
            relatedProfileTypeName: selectedProfileType,
          });
          fetchUserCustomFields();
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          setIsSaving(false);
          closeModal();
        })
        .catch((error) => {
          console.error(error);
          setIsSaving(false);
        });
    } else {
      const updatedField = {
        ...customField,
        ...data,
        ...displayOptionsState,
        targetType: type,
        contextType: 'CUSTOM',
        profileTypeIdentifier: {
          identifier: data.profileTypeIdentifier,
        },
        relatedProfileType: {
          identifier: data.relatedProfileType,
        },
      };
      delete updatedField.validationRegexSelector;
      CustomFieldsApi.updateCustomField(updatedField, type, taskListIdentifier)
        .then(() => {
          onUpdated({ ...updatedField, selectedProfileType });
          setIsSaving(false);
          closeModal();
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          setIsSaving(false);
        });
    }
  };

  const handleAddSubmit = (data) => {
    setIsSaving(true);
    if (type === 'PROFILE') {
      ProfileTypeFieldsApi.createProfileFieldType({
        ...data,
        ...displayOptionsState,
        contextType: 'CUSTOM',
        fieldCategoryType: 'PROFILE',
        targetType: 'PROFILE',
        relatedProfileType: {
          identifier: data.relatedProfileType,
        },
        profileType: {
          identifier: profileTypeIdentifier,
        },
      })
        .then((addedField) => {
          onAdded({ ...addedField, selectedProfileType });
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          setIsSaving(false);
          closeModal();
        })
        .catch(() => {
          setIsSaving(false);
        });
    } else {
      CustomFieldsApi.addCustomField(
        {
          ...data,
          ...displayOptionsState,
          targetType: type,
          contextType: 'CUSTOM',
          profileTypeIdentifier: {
            identifier: data.profileTypeIdentifier,
          },
          relatedProfileType: {
            identifier: data.relatedProfileType,
          },
        },
        type,
        taskListIdentifier,
      )
        .then((addedField) => {
          onAdded(addedField);
          setIsSaving(false);
          closeModal();
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          setIsSaving(false);
        });
    }
  };

  const handleImportModalClose = () => {
    setImportPopupOpen(false);
    fetchUserCustomFields();
    closeModal();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'grey',
    },
  };

  const getDuplicateOptionIndices = (options = []) => {
    const nameToIndices = {};

    options.forEach((option, index) => {
      const key = option.name?.trim().toLowerCase();
      if (!key) return;
      if (!nameToIndices[key]) nameToIndices[key] = [];
      nameToIndices[key].push(index);
    });

    return Object.values(nameToIndices)
      .filter((arr) => arr.length > 1)
      .flat();
  };

  const setDuplicateOptionErrors = (options = []) => {
    const duplicates = getDuplicateOptionIndices(options);

    options.forEach((_, index) =>
      formMethods.clearErrors(`options.${index}.name`),
    );

    duplicates.forEach((i) => {
      formMethods.setError(`options.${i}.name`, {
        type: 'manual',
        message: 'Duplicate option name',
      });
    });

    return duplicates.length > 0;
  };

  useEffect(() => {
    const subscription = formMethods.watch((value, { name }) => {
      if (!name?.startsWith('options')) return;

      setDuplicateOptionErrors(value?.options ?? []);
    });

    return () => subscription.unsubscribe();
  }, [formMethods]);

  const withDuplicateValidation = (handler) => (data) => {
    const hasDuplicates = setDuplicateOptionErrors(data.options);
    if (hasDuplicates) return;

    handler(data);
  };

  const submitHandler = customField?.identifier
    ? handleEditSubmit
    : handleAddSubmit;

  const finalSubmitHandler =
    fieldTypeValue === FieldType.DROPDOWN ||
    fieldTypeValue === FieldType.DROPDOWN_MULTI
      ? withDuplicateValidation(submitHandler)
      : submitHandler;

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
            <FieldForm onSubmit={handleSubmit(finalSubmitHandler)}>
              <FormScrollingContainer>
                <Box overflow="hidden">
                  <Grid container spacing={2}>
                    <Grid item mt={1} xs={15}>
                      <FormInput
                        variant="outlined"
                        sx={inputStyle}
                        required
                        autoFocus
                        name="name"
                        label="Field label name"
                      />
                    </Grid>
                    {fieldTypeValue !== FieldType.DATE &&
                      fieldTypeValue !== FieldType.HYPERLINK && (
                        <Grid item xs={12}>
                          <FormInput
                            variant="outlined"
                            sx={inputStyle}
                            name="placeholder"
                            label="Field label placeholder"
                          />
                        </Grid>
                      )}
                    {(fieldTypeValue === FieldType.TEXT ||
                      fieldTypeValue === FieldType.NUMBER) && (
                      <Grid item xs={12} style={{ display: 'flex', gap: 10 }}>
                        <FormSelect
                          variant="outlined"
                          name="validationRegexSelector"
                          label="Data validation"
                          options={REGEX_OPTIONS}
                        />
                        <FormInput
                          variant="outlined"
                          sx={inputStyle}
                          name="validationRegex"
                          label="Field validation regex"
                        />
                      </Grid>
                    )}
                    {(fieldTypeValue === FieldType.TEXT ||
                      fieldTypeValue === FieldType.NUMBER) && (
                      <Grid item xs={12}>
                        <FormInput
                          variant="outlined"
                          sx={inputStyle}
                          name="validationRegexDescription"
                          label="Validation description"
                        />
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <FormSelect
                        readOnly={!!customField}
                        required
                        variant="outlined"
                        name="fieldType"
                        label="Field type"
                        options={FIELD_TYPE_OPTIONS}
                      />
                    </Grid>
                    {type === 'PATIENT' && (
                      <Grid item xs={6}>
                        <FormSelect
                          variant="outlined"
                          required
                          disabled={fieldCategoryDisabled}
                          label="Field Category Type"
                          name="fieldCategoryType"
                          options={CATEGORY_OPTIONS}
                        />
                      </Grid>
                    )}
                    {type === 'TASK' && (
                      <Grid item xs={6}>
                        <FormSelect
                          required
                          label="Category"
                          name="fieldCategoryType"
                          options={TASK_CATEGORY_OPTIONS}
                        />
                      </Grid>
                    )}
                    {type !== 'TASK' && type !== 'PROVIDER' && (
                      <Grid item xs={6} />
                    )}
                    {fieldTypeValue === FieldType.RELATIONSHIP && (
                      <Grid item xs={6}>
                        <FormSelect
                          required
                          label="Object Type"
                          name="relatedProfileType"
                          options={profileTypeOptions}
                          onChange={(event) =>
                            setSelectedProfileType(
                              profileTypeOptions.find(
                                ({ value }) => value === event,
                              ),
                            )
                          }
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
                          const {
                            identifier,
                            name,
                            color,
                            linkedCustomFieldIdentifier,
                            linkedCustomFieldOptionIdentifier,
                          } = option;
                          return (
                            <Grid key={identifier} item xs={12}>
                              <Input
                                required
                                label={`Option ${index + 1}`}
                                {...register(`options.${index}.name`)}
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
                              <Box m={0.5} />
                              {fieldTypeValue === FieldType.DROPDOWN && (
                                <Box
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                  }}
                                >
                                  <SelectOptionColor
                                    required
                                    name={`selectOptionColor[${identifier}]`}
                                    value={color}
                                    onChange={handleOptionColorChange(
                                      identifier,
                                    )}
                                    options={ORGANIZATION_TILE_COLORS.map(
                                      ({ hex }) => ({
                                        label: (
                                          <div
                                            style={{
                                              background: hex,
                                              width: '24px',
                                              height: '24px',
                                            }}
                                          />
                                        ),
                                        value: hex,
                                      }),
                                    )}
                                  />
                                  <SelectParentDropdown
                                    label="Parent Dropdown"
                                    name={`selectParentDropdown[${identifier}]`}
                                    value={linkedCustomFieldIdentifier}
                                    onChange={handleParentDropdownChange(
                                      identifier,
                                    )}
                                    options={customFields
                                      .filter(
                                        (field) =>
                                          field.name !== fieldNameValue,
                                      )
                                      .map((field) => ({
                                        label: field.name,
                                        value: field.identifier,
                                      }))}
                                  />
                                  <SelectParentOption
                                    label="Parent Option"
                                    name={`selectParentOption[${identifier}]`}
                                    value={linkedCustomFieldOptionIdentifier}
                                    onChange={handleParentOptionChange(
                                      identifier,
                                    )}
                                    options={
                                      customFields
                                        .find(
                                          (field) =>
                                            field.identifier ===
                                            linkedCustomFieldIdentifier,
                                        )
                                        ?.options?.map((fieldOption) => ({
                                          label: fieldOption.name,
                                          value: fieldOption.identifier,
                                        })) ?? []
                                    }
                                  />
                                </Box>
                              )}
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
                        {!isCreatingNewField && (
                          <Button
                            variant="text"
                            width="auto"
                            onClick={() => setImportPopupOpen(true)}
                          >
                            <span style={{ color: 'orange' }}>+</span> Add
                            options using File
                          </Button>
                        )}
                      </>
                    )}
                  </Grid>
                  {filteredAdditionalOptions?.length > 0 && (
                    <Box m={2}>
                      <AdditionalOptions options={filteredAdditionalOptions} />
                    </Box>
                  )}
                </Box>
              </FormScrollingContainer>
              <Box m={2} />
              <Grid container justifyContent="flex-end">
                <CancelButton
                  width="auto"
                  variant="secondary"
                  onClick={closeModal}
                >
                  Cancel
                </CancelButton>
                <Box m={1} />
                <ConfirmButton type="submit" width="auto" disabled={isSaving}>
                  Save custom field
                </ConfirmButton>
              </Grid>
            </FieldForm>
          </FormProvider>
        )}
        <Dialog
          open={importPopupOpen}
          onClose={() => setImportPopupOpen(false)}
          style={{ zIndex: 5001 }}
          PaperProps={{
            elevation: 0,
            square: true,
            style: {},
          }}
        >
          <ImportDataModal
            closeModal={handleImportModalClose}
            downloadTemplate={downloadCustomFieldImportTemplate}
            step={1}
            label="option"
            uploadFunction={uploadCustomFieldOptions}
            identifier={customField?.identifier}
            type={type}
          />
        </Dialog>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditCustomFieldModal;
