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
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import { patientLabelsSelector } from 'selectors/patient-details-selectors';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { PatientEditContext } from 'context-api/patient-edit-context';
import { patientBulkAddLabel } from 'actions/patients-actions';
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
        event.stopPropagation();
        onBlur();
      }}
      onKeyDown={event => {
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
    saveEditLabel,
    removeLabelFromPatient,
    deleteLabel,
    refreshLabels,
    isFetchingLabels,
  } = initializeLabelsSectionHooks({});

  const labels = useSelector(patientLabelsSelector) || [];
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing, unsetIsEditing] = useBoolean(false);
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const optionReferences = useRef({});
  const inputReference = useRef(null);

  const patientContext = useContext(PatientEditContext);

  const { selectedPatients } = patientContext;
  const dispatch = useDispatch();

  const [selectedLabels, setSelectedLabels] = useState([]);

  const classes = useAutocompleteStyles();

  useEffect(() => {
    setSelectedLabels([]);
  }, [selectedPatients]);

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

      const labelToAdd = {
        labelIdentifier: value.labelIdentifier || null,
        labelName: value.labelName || null,
        assignedToUsers: assignedPatients,
      };

      dispatch(patientBulkAddLabel(labelToAdd));
    },
    [selectedPatients, dispatch],
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
      limitTags={2}
      options={labels}
      placeholder={
        selectedLabels.length > 0 ? '' : "Are there labels you'd like to add?"
      }
      getOptionSelected={(option, value) => {
        return option.labelIdentifier === value.labelIdentifier;
      }}
      classes={classes}
      disablePortal={!isPatientBulk}
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
        const selectedLabel = values.length - 1;
        const label = values[selectedLabel];
        saveHandler(label);

        if (currentEditableOption) {
          setCurrentEditableOption(null);
        }
        setSelectedLabels(previousProps => {
          return [...previousProps, label];
        });
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
