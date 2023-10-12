import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
// import { EditorState } from 'draft-js';
// import { useDispatch } from 'react-redux';
// import { partialUpdateTask } from 'actions/task-actions';
// import { updatePartialWorkflow } from 'actions/task-template-actions';
// import { TaskItemType } from 'helpers/task-helpers';
// import { showGlobalAlert } from 'alert/actions';
// import AlertMessages from 'alert/AlertMessages';
// import { formatMetaDataOutput } from 'components/task-drawer/CustomFieldsSection/helpers';
// import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
// import { getAllProfiles, getProfileDetails } from 'api/profile-api';
// import TextInput from '../TextInput/TextInput';
// import { CustomTextEditorContainer } from './styled';
// import { createMentionEntities } from '../TextEditor/create-mention-entities';
// import CustomFieldErrorContext from './CustomFieldErrorContext';
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
    // const dispatch = useDispatch();
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

    // useEffect(() => {
    //   getAllProfiles(relatedProfileType.identifier)
    //     .then((data) => {
    //       setProfiles(
    //         data.map((profile) => ({
    //           ...profile,
    //           label: `${
    //             profile?.fields?.[0].values?.[0] ||
    //             profile?.fields?.[0].values?.[0].value ||
    //             profile?.fields?.[0].values?.[0]?.customFieldOption?.name
    //           } ${
    //             profile?.fields?.[1].values?.[0] ||
    //             profile?.fields?.[1].values?.[0].value ||
    //             profile?.fields?.[1].values?.[0]?.customFieldOption?.name
    //           }`,
    //         })),
    //       );

    //       //   setProfileIdentifiers(data.map((profile) => profile.identifier));
    //     })
    //     .catch((error) => {
    //       console.error('error getting profile types');
    //       console.error(error);
    //     });
    // }, [relatedProfileType.identifier]);

    const error = errors?.[name]?.message;

    const handleChange = useCallback(
      (event) => {
        if (error) clearErrors(name);
        // setValue(name, event.target.value);
        setValue(name, event);
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
