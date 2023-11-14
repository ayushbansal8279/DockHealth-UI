import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { getAllProfiles, getProfileDetails } from 'api/profile-api';
import { getProfileName } from 'views/custom-profile-details/helpers';
import Autocomplete from '../Autocomplete/Autocomplete';

const CustomFieldAutoComplete = React.forwardRef(
  (
    {
      readOnly,
      name,
      label,
      onChange,
      // fieldName,
      placeholder,
      // relatedFieldType,
      // task,
      // fieldsGroupKey,
      inputRef,
      // characterLimit,
      relatedProfileType,
      ...restProps
    },
    reference,
  ) => {
    const dispatch = useDispatch();
    const {
      register,
      clearErrors,
      formState: { errors },
      // watch,
      setValue,
      unregister,
    } = useFormContext();

    // console.log(`name from server: ${JSON.stringify(name)}`);
    // const value = watch(name);

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
                // eslint-disable-next-line no-shadow
                const profiles = data.map((profile) => ({
                  profile,
                  label: getProfileName(profileTypeFields, profile)?.join(' '),
                }));
                setProfiles(profiles);
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
    }, [dispatch, relatedProfileType]);

    const error = errors?.[name]?.message;

    const handleChange = useCallback(
      (event) => {
        if (error) clearErrors(name);
        // setValue(name, event.target.value);
        const selectedValues = event?.map(
          (value) => value?.profile?.identifier,
        );
        setValue(name, selectedValues);
        // if (typeof onChange === 'function') onChange(event.target.value);
        if (typeof onChange === 'function') onChange(event);
      },
      [clearErrors, error, name, onChange, setValue],
    );

    const getInputReference = () => inputRef;
    return (
      <Autocomplete
        multiple
        name={name}
        autoFocus={false}
        options={profiles ?? []}
        label={label}
        // isInputDisabled={readOnly}
        placeholder={placeholder ?? `Are there any ${label} you'd like to add?`}
        isDisabled={readOnly}
        // value={name.identifier}
        // value={selectedLabels}
        // disableCloseOnSelect={!!currentEditableOption p}
        getInputReference={getInputReference}
        // getOptionLabel={(option) => option?.labelName}
        // isDisabled={!!currentEditableOption}
        // renderOption={renderOptionCallback}
        // renderTags={renderTagsCallback}
        // onInputChange={(event) => {
        //   onChange(event);
        //   handleChange(event);
        // }}
        onInputChange={onChange}
        // InputProps={{
        //   onKeyDown: (event) => {
        //     if (event.key === 'Enter' && event?.target.value !== '') {
        //       event.stopPropagation();
        //       event.preventDefault();
        //       event?.target?.blur();
        //       handleSave({ labelName: inputState });
        //       // saveAddLabel({ labelName: inputState });
        //     }
        //   },
        // }}
        // noOptionsText={noOptionText}
        // onOpen={refreshLabels}
        // isLoading={isLoadingLabels}
        // onChange={(values) => {
        //   const valuesLength = values.length;
        //   const value = values[valuesLength - 1];
        //   // saveAddLabel(value);
        //   handleSave(value);
        //   if (currentEditableOption) {
        //     setCurrentEditableOption(null);
        //   }
        // }}
        // onChange={(event) => {
        //   onChange(event);
        //   handleChange(event);
        // }}
        onChange={handleChange}
        disableClearable
        {...restProps}
      />
    );
  },
);

export default CustomFieldAutoComplete;
