import React, { useState, useRef } from 'react';
import { RobotoTypography } from 'styles/theme';
import { Grid } from '@material-ui/core';

import useBoolean from 'hooks/useBoolean';
import EditableLabel from './NewTaskDrawer.EditableLabel';
import SelectInput from './NewTaskDrawer.SelectInput';
import {
  getFormattedLabels,
  getFormattedLabel,
  FocusDrawerFieldEnum,
} from './NewTaskDrawer.Utilities';
import initializeLabelsSectionHooks from './NewTaskDrawer.LabelsSection.Hooks';

const LabelsSection = ({
  selectedTask,
  isInbox,
  parentFormSubmit,
  setAutoSaveVisible,
  setSelectedLabelsValue,
  taskDrawerFocusField,
  refreshList,
}) => {
  const {
    labels,
    saveAddLabel,
    saveEditLabel,
    removeLabelFromTask,
    saveTaskOnFocus,
    refreshLabels,
  } = initializeLabelsSectionHooks({
    isInbox,
    parentFormSubmit,
    setAutoSaveVisible,
    setSelectedLabelsValue,
    refreshList,
  });

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const formattedLabels = getFormattedLabels({
    labels,
    selectedTaskIdentifier,
  });

  const [currentlyEditedOption, setCurrentlyEditedOption] = useState(null);

  const [forceOpen, enableForceOpen, disableForceOpen] = useBoolean(false);

  const labelsInputReference = useRef(null);

  return (
    <SelectInput
      ref={labelsInputReference}
      name="labels"
      label="Labels"
      placeholder="Are there labels you'd like to add?"
      multiple
      key={selectedTaskIdentifier ?? 'null'}
      noOptionsText={
        <Grid container direction="column" style={{ padding: '10px 10px' }}>
          <RobotoTypography condensed variant="h4" color="inherit">
            No labels found
          </RobotoTypography>
        </Grid>
      }
      renderItem={option => (
        <EditableLabel
          key={`label_wrapper_${option?.key}`}
          option={option}
          isInbox={isInbox}
          currentlyEditedOption={currentlyEditedOption}
          setCurrentlyEditedOption={setCurrentlyEditedOption}
          enableForceOpen={enableForceOpen}
          disableForceOpen={disableForceOpen}
          saveEditLabel={saveEditLabel}
          setAutoSaveVisible={setAutoSaveVisible}
          refreshLabels={refreshLabels}
        />
      )}
      // getOptionDisabled={option => {
      //   return false;
      // }}
      onItemSelected={(options, selectedOption) => {
        if (selectedTask && selectedTask?.taskIdentifier !== '') {
          saveAddLabel(selectedOption);
        }
      }}
      onItemRemoved={(options, removedOption) => {
        if (selectedTask && selectedTask?.taskIdentifier !== '') {
          removeLabelFromTask(removedOption);
        }
      }}
      formatTagItem={(key, value) => {
        return getFormattedLabel({
          labelIdentifier: key,
          labelName: value,
        });
      }}
      InputProps={{}}
      endAdornmentEnabled
      forceOpen={forceOpen}
      onFocusCallback={() => {
        saveTaskOnFocus();
      }}
      autoFocusEnabled={taskDrawerFocusField === FocusDrawerFieldEnum.LABEL}
    >
      {formattedLabels}
    </SelectInput>
  );
};

export default LabelsSection;
