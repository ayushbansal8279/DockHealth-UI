/* eslint-disable no-unused-expressions */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  patientLabelsSelector,
  patientSelector,
} from 'selectors/patient-details-selectors';
import { PatientEditContext } from 'context-api/patient-edit-context';
import {
  patientAddLabel,
  patientBulkAddLabel,
  patientBulkDeleteLabel,
  patientDeleteLabel,
} from 'actions/patients-actions';
import initializeLabelsSectionHooks from './hooks';
import {
  OptionContainer,
  OptionButtonsContainer,
  OptionButton,
  OptionButtonsInput,
  NoOptionTextLabel,
  NoOptionContainer,
  Autocomplete,
} from './styled';

function makeBulkLabelToSend(value, assignedPatients) {
  return {
    labelIdentifier: value.labelIdentifier,
    labelName: value.labelName,
    assignedToUsers: assignedPatients,
  };
}

function makeLabelToSend(value, patientId) {
  return {
    labelIdentifier: value.labelIdentifier,
    labelName: value.labelName,
    patientIdentifier: patientId,
  };
}

const renderOption = ({
  isEditable,
  option,
  registerOption,
  onEdit,
  onBlur,
  onSaveEdit,
  onDelete,
  onClick,
}) => (
  <OptionContainer key={option?.labelIdentifier} isEditable={isEditable}>
    <OptionButtonsInput
      ref={registerOption}
      defaultValue={option?.labelName}
      onBlur={(event) => {
        event.stopPropagation();
        onBlur();
      }}
      onClick={onClick}
      onKeyDown={(event) => {
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
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onEdit();
        }}
      >
        Edit
      </OptionButton>
      <OptionButton
        type="button"
        onClick={(event) => {
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
const PatientLabels = ({ isPatientBulk, disableFocusOnRender = false }) => {
  const { saveEditLabel, deleteLabel, refreshLabels, isFetchingLabels } =
    initializeLabelsSectionHooks({});

  const labels = useSelector(patientLabelsSelector) || [];
  const [inputValue, setInputValue] = useState('');
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const optionReferences = useRef({});
  const inputReference = useRef(null);

  const patientContext = useContext(PatientEditContext);
  const patient = useSelector(patientSelector);
  const { selectedPatients } = patientContext;
  const dispatch = useDispatch();

  const [selectedLabels, setSelectedLabels] = useState([]);
  useEffect(() => {
    if (selectedPatients) {
      setSelectedLabels([]);
    }
    if (patient) {
      setSelectedLabels(patient.patientLabels ?? []);
    }
  }, [selectedPatients, patient]);

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    } else {
      inputReference.current?.focus();
    }
  }, [currentEditableOption, inputReference, disableFocusOnRender]);

  const getInputReference = (element) => {
    inputReference.current = element;
  };

  const removeHandler = useCallback(
    (value) => {
      const assignedPatients = selectedPatients?.map((singlePatient) => {
        return singlePatient.patientIdentifier;
      });
      if (assignedPatients) {
        const labelToRemove = makeBulkLabelToSend(value, assignedPatients);
        dispatch(patientBulkDeleteLabel(labelToRemove));
      } else {
        const labelToRemove = makeLabelToSend(value, patient.patientIdentifier);
        dispatch(patientDeleteLabel(labelToRemove));
      }
      setSelectedLabels((previousState) => {
        return (
          previousState.filter(
            (label) => label.labelIdentifier !== value.labelIdentifier,
          ) ?? []
        );
      });
    },
    [dispatch, selectedPatients, patient],
  );

  const saveHandler = useCallback(
    (value) => {
      const assignedPatients = selectedPatients?.map((singlePatient) => {
        return singlePatient.patientIdentifier;
      });

      if (assignedPatients) {
        const labelToAdd = makeBulkLabelToSend(value, assignedPatients);
        dispatch(patientBulkAddLabel(labelToAdd));
      } else {
        const labelToAdd = makeLabelToSend(value, patient.patientIdentifier);
        dispatch(patientAddLabel(labelToAdd));
      }
    },
    [selectedPatients, dispatch, patient],
  );

  const renderOptionCallback = useCallback(
    (_, option) =>
      renderOption({
        option,
        registerOption: (element) => {
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
        onSaveEdit: (value) => saveEditLabel(option?.labelIdentifier, value),
        onDelete: () => deleteLabel(option),
        onClick: () => {
          if (
            currentEditableOption &&
            currentEditableOption !== option?.labelIdentifier
          ) {
            setCurrentEditableOption(null);
          }
          setSelectedLabels((previousLabels) => {
            if (
              previousLabels.some(
                (label) => label.labelIdentifier === option.labelIdentifier,
              )
            ) {
              return previousLabels;
            }
            saveHandler(option);
            return [...previousLabels, option];
          });
        },
      }),
    [currentEditableOption, deleteLabel, saveEditLabel, saveHandler],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map((option) => (
        <Chip
          key={option.labelIdentifier}
          onDelete={() => removeHandler(option)}
          label={option.labelName}
        />
      )),
    [removeHandler, selectedLabels],
  );

  const noOptionText = useMemo(
    () => (
      <div
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={(event) => {
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

  return (
    <Autocomplete
      isOpen={isOpen}
      autoFocus={!disableFocusOnRender}
      limitTags={2}
      options={labels}
      value={selectedLabels}
      placeholder={
        selectedLabels.length > 0 ? '' : "Are there labels you'd like to add?"
      }
      isOptionEqualToValue={(option, value) =>
        option.labelIdentifier === value.labelIdentifier
      }
      disablePortal={!isPatientBulk}
      getInputReference={getInputReference}
      getOptionLabel={(option) => option?.labelName}
      isDisabled={!!currentEditableOption}
      renderOption={renderOptionCallback}
      renderTags={renderTagsCallback}
      onInputChange={setInputValue}
      InputProps={{
        onKeyDown: (event) => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            event?.target?.blur();
            saveHandler({ labelName: inputValue });
          }
        },
      }}
      noOptionsText={noOptionText}
      onOpen={() => {
        refreshLabels();
        setIsOpen(true);
      }}
      onClose={() => !currentEditableOption && setIsOpen(false)}
      isLoading={isFetchingLabels}
      // onChange={(values, reason) => {
      //   if (reason !== 'select-option') {
      //     return;
      //   }
      //   const selectedLabel = values.length - 1;
      //   const labelToAdd = values[selectedLabel];
      //   saveHandler(labelToAdd);

      //   if (currentEditableOption) {
      //     setCurrentEditableOption(null);
      //   }
      //   setSelectedLabels((previousProps) => {
      //     return [...previousProps, labelToAdd];
      //   });
      // }}
      multiple
      disableClearable
      disableCloseOnSelect
    />
  );
};

export default PatientLabels;
