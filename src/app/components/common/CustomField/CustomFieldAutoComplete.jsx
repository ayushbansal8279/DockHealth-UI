import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { getAllProfiles } from 'api/profile-api';
import { getProfileName } from 'views/custom-profile-details/helpers';
import Autocomplete from '../Autocomplete/Autocomplete';

const CustomFieldAutoComplete = ({
  readOnly,
  name,
  label,
  onChange,
  placeholder,
  inputRef,
  relatedProfileType,
  onBlur,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const {
    register,
    clearErrors,
    formState: { errors },
    setValue,
    unregister,
    watch,
  } = useFormContext();

  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [name, register, unregister]);

  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    if (relatedProfileType) {
      getAllProfileFieldTypes(relatedProfileType?.identifier)
        .then((profileTypeFields) => {
          getAllProfiles(relatedProfileType.identifier)
            .then((data) => {
              const newProfiles = data
                .filter(profile => profile.fields)
                .map((profile) => ({
                  profile,
                  label: getProfileName(profileTypeFields, profile)?.join(' '),
                }));
              setProfiles(newProfiles);
            })
            .catch((error) => {
              console.error('error getting profile types');
              console.error(error);
            });
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
        });
    }
  }, [dispatch,relatedProfileType?.identifier]);

  const error = errors?.[name]?.message;

  const handleChange = useCallback(
    (event) => {
      if (error) clearErrors(name);
      const selectedValues = event?.map((value) => value?.profile?.identifier);
      setValue(name, selectedValues);
      if (typeof onChange === 'function') onChange(event);
    },
    [clearErrors, error, name, onChange, setValue],
  );

  const selectedValues = watch(name);
  const selectedOptions = profiles?.filter((profile) =>
    selectedValues?.includes(profile.profile.identifier),
  );

  const getInputReference = () => inputRef;
  return (
    <Autocomplete
      value={selectedOptions || []}
      multiple
      name={name}
      autoFocus={false}
      options={profiles ?? []}
      label={label}
      placeholder={placeholder ?? `Are there any ${label} you'd like to add?`}
      isDisabled={readOnly}
      getInputReference={getInputReference}
      onInputChange={onChange}
      onChange={handleChange}
      onBlurInput={(event) => onBlur(event, true)}
      disableClearable
      {...restProps}
    />
  );
};

export default CustomFieldAutoComplete;
