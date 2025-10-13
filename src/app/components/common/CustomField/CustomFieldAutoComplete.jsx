import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { getAllProfiles } from 'api/profile-api';
import { getProfileName } from 'views/custom-profile-details/helpers';
import Autocomplete from '../Autocomplete/Autocomplete';
import { FormHelperText } from '@mui/material';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from '@/app/api/patients-api';
import { getPatientById } from '@/app/api/patient-api';

const CustomFieldAutoComplete = ({
  readOnly,
  name,
  label,
  onChange,
  inputRef,
  relatedProfileType,
  onBlur,
  required,
  multiple = true,
  value: externalValue,
  formMethods,
  ...restProps
}) => {
  const formContext = useFormContext();
  const dispatch = useDispatch();
  const {
    register,
    clearErrors,
    formState: { errors },
    setValue,
    unregister,
    watch,
  } = formMethods || formContext;
  const {
    profileIdentifier,
    relationshipProfileIdentifier,
    patientIdentifier,
  } = useParams();

  const isPatientMode =
    relatedProfileType?.contextType === 'PREDEFINED' &&
    relatedProfileType?.name?.toLowerCase() === 'patients';

  useEffect(() => {
    if (required) {
      register(name, {
        required: 'This field is required',
        validate: (value) => {
          if (multiple) {
            const arr = Array.isArray(value) ? value : value ? [value] : [];
            return arr.length > 0 ? true : 'This field is required';
          } else {
            return value ? true : 'This field is required';
          }
        },
      });
    } else {
      register(name);
    }
    return () => {
      unregister(name);
    };
  }, [name, register, unregister, required]);

  const [profiles, setProfiles] = useState(null);
  const [isAutoSelected, setIsAutoSelected] = useState(false);

  useEffect(() => {
    if (!relatedProfileType) return;
    if (isPatientMode) return;

    if (relatedProfileType) {
      getAllProfileFieldTypes(relatedProfileType?.identifier)
        .then((profileTypeFields) => {
          getAllProfiles(relatedProfileType.identifier)
            .then((data) => {
              let filteredProfiles = data.filter((profile) => profile.fields);

              if (relationshipProfileIdentifier && profileIdentifier) {
                filteredProfiles = filteredProfiles.filter(
                  (profile) => profile.identifier === profileIdentifier,
                );
              }

              const newProfiles = filteredProfiles.map((profile) => ({
                profile,
                label: getProfileName(profileTypeFields, profile)?.join(' '),
              }));

              setProfiles(newProfiles);

              if (
                relationshipProfileIdentifier &&
                profileIdentifier &&
                newProfiles.length === 1
              ) {
                const singleProfile = newProfiles[0];
                setValue(name, [singleProfile.profile.identifier], {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                setIsAutoSelected(true);
              }
            })
            .catch((error) => {
              console.error('error getting object types');
              console.error(error);
            });
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
        });
    }
  }, [
    dispatch,
    relatedProfileType?.identifier,
    relationshipProfileIdentifier,
    profileIdentifier,
    patientIdentifier,
    name,
    setValue,
  ]);

  const debouncedFetchPatients = useMemo(
    () =>
      debounce(async (search) => {
        if (!isPatientMode || !search) return;
        try {
          const patients = await getPatientsByCriteria(search);
          const mappedPatients = patients.map((patient) => ({
            patient,
            label: patient.patientName,
          }));

          setProfiles((prev) => {
            const prevMap = new Map(
              (prev ?? []).map((p) => [p.patient.patientIdentifier, p]),
            );

            mappedPatients.forEach((p) => {
              prevMap.set(p.patient.patientIdentifier, p);
            });

            return Array.from(prevMap.values());
          });
        } catch (e) {
          console.error('Error fetching patients:', e);
        }
      }, 400),
    [isPatientMode],
  );

  const [searchValue, setSearchValue] = useState('');
  const handleInputChange = (newInputValue) => {
    setSearchValue(newInputValue);
    if (isPatientMode) {
      debouncedFetchPatients(newInputValue);
    }

    if (typeof onChange === 'function') {
      onChange(newInputValue);
    }
  };

  const isFieldReadOnly = readOnly || isAutoSelected;

  const isNested = name?.includes('.');
  const nestedParts = name?.split('.');

  const error = isNested
    ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
    : errors?.[name]?.message;

  const handleChange = useCallback(
    (event, reason) => {
      if (isAutoSelected) return;
      if (error) clearErrors(name);

      let selectedValues;

      if (multiple) {
        selectedValues = (event || []).map((option) =>
          isPatientMode
            ? option?.patient?.patientIdentifier
            : option?.profile?.identifier,
        );
      } else {
        const option = event || null;
        selectedValues = option
          ? [
              isPatientMode
                ? option.patient.patientIdentifier
                : option.profile.identifier,
            ]
          : null;
      }

      setValue(name, selectedValues, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (typeof onChange === 'function') onChange(event, reason);
    },
    [
      clearErrors,
      error,
      name,
      onChange,
      setValue,
      multiple,
      isAutoSelected,
      isPatientMode,
    ],
  );

  const formValue = watch(name);

  const currentValue = externalValue !== undefined ? externalValue : formValue;

  useEffect(() => {
    if (!isPatientMode) return;
    if (!currentValue) return;

    const valueArray = Array.isArray(currentValue)
      ? currentValue
      : [currentValue];

    Promise.all(valueArray.map((id) => getPatientById(id)))
      .then((patients) => {
        const mapped = patients.map((patient) => ({
          patient,
          label: patient.patientName,
        }));
        setProfiles(mapped);
      })
      .catch((err) => {
        console.error('Error fetching patients by ID:', err);
      });
  }, [isPatientMode, currentValue]);

  useEffect(() => {
    if (!isPatientMode) return;
    if (!patientIdentifier) return;

    getPatientById(patientIdentifier)
      .then((patient) => {
        const mappedPatient = {
          patient,
          label: patient.patientName,
        };
        setProfiles([mappedPatient]);

        setValue(name, [patient.patientIdentifier], {
          shouldValidate: true,
          shouldDirty: true,
        });
        setIsAutoSelected(true);
      })
      .catch((error) => {
        console.error('Error fetching patient for auto-selection:', error);
      });
  }, [isPatientMode, patientIdentifier, name, setValue]);

  const selectedOptions = useCallback(() => {
    if (!profiles || !currentValue) return multiple ? [] : null;

    if (multiple) {
      const valueArray = Array.isArray(currentValue)
        ? currentValue
        : currentValue
        ? [currentValue]
        : [];
      return profiles.filter((option) =>
        valueArray.includes(
          isPatientMode
            ? option.patient.patientIdentifier
            : option.profile.identifier,
        ),
      );
    } else {
      const singleValue =
        typeof currentValue === 'string' ? currentValue : currentValue?.[0];
      return (
        profiles.find((option) =>
          isPatientMode
            ? option.patient.patientIdentifier === singleValue
            : option.profile.identifier === singleValue,
        ) || null
      );
    }
  }, [profiles, currentValue, multiple, isPatientMode]);

  const getInputReference = () => inputRef;

  return (
    <>
      <Autocomplete
        value={selectedOptions()}
        multiple={multiple}
        name={name}
        autoFocus={false}
        options={profiles ?? []}
        label={label}
        isDisabled={isFieldReadOnly}
        getInputReference={getInputReference}
        {...(multiple ? { inputValue: searchValue } : {})}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlurInput={(event) => onBlur(event, true)}
        disableClearable
        hasError={!!error}
        errorMessage={error}
        required={required}
        {...restProps}
      />
      {error && (
        <FormHelperText error sx={{ pl: 1.5 }}>
          {error}
        </FormHelperText>
      )}
    </>
  );
};

export default CustomFieldAutoComplete;
