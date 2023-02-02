/* eslint-disable no-unused-expressions */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Chip } from '@mui/material';
import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import usePrevious from 'hooks/use-previous';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
  workflowLabelsSelector,
} from 'selectors/workflow-drawer-selectors';
import {
  addLabel,
  editLabel,
  removeLabelFromTask,
  removeLabel,
} from 'actions/task-template-actions';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { getLabels } from 'actions/workflow-drawer-actions';
import {
  OptionContainer,
  OptionButtonsContainer,
  OptionButton,
  OptionButtonsInput,
  NoOptionTextLabel,
  NoOptionContainer,
} from './styled';

const renderOption = ({
  isEditable,
  option,
  registerOption,
  onEdit,
  onBlur,
  onSaveEdit,
  onDelete,
  disabled,
}) => {
  return (
    <OptionContainer
      key={option?.labelIdentifier}
      isEditable={isEditable}
      disabled={disabled}
    >
      <OptionButtonsInput
        greyed={disabled}
        ref={registerOption}
        defaultValue={option?.labelName}
        onBlur={(event) => {
          event.stopPropagation();
          onBlur();
        }}
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
};

const LabelsSection = ({ disabled: disabledProperty }) => {
  const labels = useSelector(workflowLabelsSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const {
    identifier,
    labels: selectedLabelsFromStore = [],
    taskListIdentifier,
  } = selectedWorkflow || {};
  const [inputState, setInputState] = useState();
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const optionReferences = useRef({});
  const [inputReference, setInputReference] = useState(null);
  const dispatch = useDispatch();
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const selectedLabelsFromStoreLength = selectedLabelsFromStore?.length;
  const previousSelectedLabelsFromStoreLength = usePrevious(
    selectedLabelsFromStoreLength,
  );
  const isTemplateWorkflow = checkIfTemplateWorkflow(selectedWorkflow);

  const getAllLabels = useCallback(async () => {
    dispatch(getLabels(isTemplateWorkflow, taskListIdentifier));
  }, [dispatch, isTemplateWorkflow, taskListIdentifier]);

  useEffect(() => {
    setLabelsList(labels);
  }, [labels]);

  useEffect(() => {
    if (selectedLabelsFromStoreLength > previousSelectedLabelsFromStoreLength) {
      setSelectedLabels(selectedLabelsFromStore);
    }
  }, [
    previousSelectedLabelsFromStoreLength,
    selectedLabelsFromStore,
    selectedLabelsFromStoreLength,
  ]);

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    }
  }, [currentEditableOption, inputReference]);

  const handleAddLabel = useCallback(
    ({ labelIdentifier, labelName }) => {
      const alreadySelected = selectedLabels.find(
        (label) => label.labelName === labelName,
      );
      if (!alreadySelected && (labelName || labelName !== '')) {
        setSelectedLabels((state) => [
          ...state,
          { labelIdentifier, labelName, identifier },
        ]);
        dispatch(
          addLabel({
            labelIdentifier,
            labelName,
            identifier,
            isTemplateWorkflow,
            taskListIdentifier,
          }),
        );
      }
    },
    [
      dispatch,
      identifier,
      selectedLabels,
      isTemplateWorkflow,
      taskListIdentifier,
    ],
  );

  const handleEditLabel = useCallback(
    ({ labelIdentifier, labelName }) => {
      const findAndUpdate = (state) =>
        state.map((label) =>
          label.labelIdentifier === labelIdentifier
            ? { ...label, labelName }
            : label,
        );
      setLabelsList(findAndUpdate);
      setSelectedLabels(findAndUpdate);
      dispatch(editLabel({ labelIdentifier, labelName, identifier }));
    },
    [dispatch, identifier],
  );

  const handleRemoveLabel = useCallback(
    ({ labelIdentifier, labelName }) => {
      const findAndRemove = (state) =>
        state.filter((label) => label.labelIdentifier !== labelIdentifier);
      setSelectedLabels(findAndRemove);
      setLabelsList(findAndRemove);
      dispatch(removeLabel({ labelIdentifier, labelName, identifier }));
    },
    [dispatch, identifier],
  );

  const getInputReference = (element) => {
    if (inputReference !== element) setInputReference(element);
  };

  const renderOptionCallback = useCallback(
    (option) => {
      const disabled = !!selectedLabels.find(
        (label) => label.labelIdentifier === option.labelIdentifier,
      );
      return renderOption({
        option,
        disabled,
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
        onSaveEdit: (value) =>
          handleEditLabel({
            labelIdentifier: option?.labelIdentifier,
            labelName: value,
          }),
        onDelete: () => handleRemoveLabel(option),
      });
    },
    [handleEditLabel, handleRemoveLabel, selectedLabels],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map((option) => (
        <Chip
          deletable={!!option.labelIdentifier}
          key={option.labelIdentifier}
          onDelete={() => {
            setSelectedLabels((state) =>
              state.filter(
                (label) => label.labelIdentifier !== option.labelIdentifier,
              ),
            );
            dispatch(
              removeLabelFromTask({
                labelIdentifier: option.labelIdentifier,
                identifier: option.taskWorkflowIdentifier,
              }),
            );
          }}
          label={option.labelName}
        />
      )),
    [dispatch, selectedLabels],
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
            if (inputState) {
              event.stopPropagation();
              event.preventDefault();
              handleAddLabel({ labelName: inputState });
            }
          }}
        >
          {inputState ? (
            <>
              No results - Create
              <NoOptionTextLabel>{inputState}</NoOptionTextLabel> label
            </>
          ) : (
            <>No results</>
          )}
        </NoOptionContainer>
      </div>
    ),
    [handleAddLabel, inputState],
  );

  return (
    <Autocomplete
      autoFocus={autoFocusFieldName === WorkflowDrawerFieldNames.LABEL}
      options={labelsList}
      label="Labels"
      placeholder="Are there labels you'd like to add?"
      value={selectedLabels}
      disableCloseOnSelect={!!currentEditableOption}
      getInputReference={getInputReference}
      getOptionLabel={(option) => option?.labelName}
      isDisabled={disabledProperty}
      renderOption={renderOptionCallback}
      renderTags={renderTagsCallback}
      onInputChange={setInputState}
      InputProps={{
        onKeyDown: (event) => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            event?.target?.blur();
            handleAddLabel({ labelName: inputState });
          }
        },
      }}
      noOptionsText={noOptionText}
      onOpen={getAllLabels}
      onChange={(values) => {
        const valuesLength = values.length;
        const value = values[valuesLength - 1];
        handleAddLabel(value);
        if (currentEditableOption) {
          setCurrentEditableOption(null);
        }
      }}
      multiple
      disableClearable
    />
  );
};

export default LabelsSection;
