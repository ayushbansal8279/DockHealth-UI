/* eslint-disable no-unused-expressions */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { Chip } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import { useSelector } from 'react-redux';
import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import {
  patientSelector,
  patientLabelsSelector,
} from 'selectors/patient-details-selectors';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { patientBulkAddLabel } from 'api/patients-api';
import { PatientEditContext } from 'context-api/patient-edit-context';
import initializeLabelsSectionHooks from './hooks';
import {
  OptionContainer,
  OptionButtonsContainer,
  OptionButton,
  OptionButtonsInput,
  NoOptionTextLabel,
  NoOptionContainer,
  ReadOnlyLabelsContainer,
  ReadOnlyLabelContainer,
  useAutocompleteStyles,
} from './styled';

const renderOption = ({
  isEditable,
  option,
  registerOption,
  onEdit,
  onBlur,
  onSaveEdit,
  onDelete,
}) => (
  <OptionContainer key={option?.labelIdentifier} isEditable={isEditable}>
    <OptionButtonsInput
      ref={registerOption}
      defaultValue={option?.labelName}
      onBlur={event => {
        console.log('blur');
        event.stopPropagation();
        onBlur();
      }}
      onKeyDown={event => {
        console.log('key');
        if (event.key === 'Enter') {
          event?.target?.blur();
          if (
            event?.target.value !== option?.labelName &&
            event?.target.value !== ''
          ) {
            onSaveEdit(event?.target.value);
          }
        }

        if (event.key === 'Escape') {
          event?.target?.blur();
          // eslint-disable-next-line no-param-reassign
          event.target.value = option?.labelName;
        }
      }}
    />
    <OptionButtonsContainer>
      <OptionButton
        type="button"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          onEdit();
        }}
      >
        Edit
      </OptionButton>
      <OptionButton
        type="button"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          onDelete();
        }}
      >
        Delete
      </OptionButton>
    </OptionButtonsContainer>
  </OptionContainer>
);

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientLabels = ({ isPatientBulk }) => {
  const {
    saveAddLabel,
    saveEditLabel,
    removeLabelFromPatient,
    deleteLabel,
    refreshLabels,
    isFetchingLabels,
  } = initializeLabelsSectionHooks({});

  const patient = useSelector(patientSelector);
  const labels = useSelector(patientLabelsSelector) || [];
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing, unsetIsEditing] = useBoolean(false);
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const optionReferences = useRef({});
  const inputReference = useRef(null);

  const patientContext = useContext(PatientEditContext);

  const { selectedPatients } = patientContext;

  const selectedLabels = useMemo(() => patient?.patientLabels || [], [patient]);

  const classes = useAutocompleteStyles();

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    } else {
      inputReference.current?.focus();
    }
  }, [currentEditableOption, inputReference]);

  const getInputReference = element => {
    inputReference.current = element;
  };
  console.log(labels);
  const renderOptionCallback = useCallback(
    option =>
      renderOption({
        option,
        registerOption: element => {
          if (element) {
            optionReferences.current[option?.labelIdentifier] = element;
          }
        },
        onEdit: () => {
          setCurrentEditableOption(option?.labelIdentifier);
        },
        onBlur: () => {
          setCurrentEditableOption(null);
        },
        onSaveEdit: value => saveEditLabel(option?.labelIdentifier, value),
        onDelete: () => deleteLabel(option),
      }),
    [deleteLabel, saveEditLabel],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map(option => (
        <Chip
          key={option.labelIdentifier}
          onDelete={() => removeLabelFromPatient(option)}
          label={option.labelName}
        />
      )),
    [removeLabelFromPatient, selectedLabels],
  );

  const saveHandler = useCallback(
    value => {
      const assignedPatients = selectedPatients?.map(singlePatient => {
        return singlePatient.patientIdentifier;
      });

      const newValue = {
        labelIdentifier: value.labelIdentifier || null,
        labelName: value.labelName || null,
        patientIdentifier: value.patientIdentifier || null,
      };

      isPatientBulk
        ? patientBulkAddLabel({
            ...newValue,
            assignedToUsers: assignedPatients,
          })
        : saveAddLabel(newValue);
    },
    [isPatientBulk, saveAddLabel, selectedPatients],
  );

  const noOptionText = useMemo(
    () => (
      <div
        onMouseDown={event => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={event => {
            if (inputValue) {
              event.stopPropagation();
              event.preventDefault();
              saveHandler({ labelName: inputValue });
            }
          }}
        >
          {inputValue ? (
            <>
              No results - Create{' '}
              <NoOptionTextLabel>{inputValue}</NoOptionTextLabel> label
            </>
          ) : (
            <>No results</>
          )}
        </NoOptionContainer>
      </div>
    ),
    [inputValue, saveHandler],
  );

  return isEditing ? (
    <Autocomplete
      autoFocus
      options={labels}
      placeholder={"Are there labels you'd like to add?"}
      classes={classes}
      disablePortal={!isPatientBulk}
      value={selectedLabels}
      disableCloseOnSelect={!!currentEditableOption}
      getInputReference={getInputReference}
      getOptionLabel={option => option?.labelName}
      isDisabled={!!currentEditableOption}
      renderOption={renderOptionCallback}
      renderTags={renderTagsCallback}
      onInputChange={setInputValue}
      InputProps={{
        onKeyDown: event => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            event?.target?.blur();
            saveHandler({ inputValue });
          }
          if (event.key === 'Escape') {
            unsetIsEditing();
          }
        },
      }}
      noOptionsText={noOptionText}
      onOpen={refreshLabels}
      isLoading={isFetchingLabels}
      onChange={values => {
        const valuesLength = values.length;
        const value = values[valuesLength - 1];
        saveHandler(value);

        if (currentEditableOption) {
          setCurrentEditableOption(null);
        }
      }}
      multiple
      disableClearable
    />
  ) : (
    <ReadOnlyLabelsContainer isPatientBulk={isPatientBulk}>
      {selectedLabels.map(label => (
        <ReadOnlyLabelContainer key={label.labelIdentifier}>
          <Chip
            key={label.labelIdentifier}
            clickable
            label={label.labelName}
            onClick={setIsEditing}
          />
        </ReadOnlyLabelContainer>
      ))}
      <ReadOnlyLabelContainer>
        <Tooltip title="Add a label" placement="bottom">
          <Chip
            key="add"
            clickable
            textcolor={palette.orange}
            label="+"
            onClick={setIsEditing}
          />
        </Tooltip>
      </ReadOnlyLabelContainer>
    </ReadOnlyLabelsContainer>
  );
};

export default PatientLabels;
