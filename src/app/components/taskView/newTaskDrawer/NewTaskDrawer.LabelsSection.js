import React, { useState, useRef } from 'react';
import { RobotoTypography } from 'styles/theme';
import { Grid } from '@material-ui/core';

import useBoolean from 'hooks/useBoolean';
import EditableLabel from './NewTaskDrawer.EditableLabel';
import SelectInput from './NewTaskDrawer.SelectInput';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';
import initializeLabelsSectionHooks from './NewTaskDrawer.LabelsSection.Hooks';

const LabelsSection = ({
  selectedTask,
  isInbox,
  parentFormSubmit,
  setAutoSaveVisible,
}) => {
  const {
    labels,
    saveAddOrRemoveLabel,
    saveEditLabel,
    saveTaskOnFocus,
  } = initializeLabelsSectionHooks({
    isInbox,
    parentFormSubmit,
    setAutoSaveVisible,
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
        />
      )}
      // getOptionDisabled={option => {
      //   return false;
      // }}
      onItemSelected={options => {
        // console.log('Label Selected');
        if (selectedTask && selectedTask?.taskIdentifier !== '') {
          saveAddOrRemoveLabel(options);
        }
      }}
      InputProps={{}}
      createTagActionLabel="Create Label"
      forceOpen={forceOpen}
      onFocusCallback={() => {
        saveTaskOnFocus();
      }}
    >
      {formattedLabels}
    </SelectInput>
  );
};

export default LabelsSection;
