import React, { useState } from 'react';

import { RobotoTypography } from 'styles/theme';

import useBoolean from 'hooks/useBoolean';
import EditableLabel from './NewTaskDrawer.EditableLabel';
import SelectInput from './NewTaskDrawer.SelectInput';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';
import initializeLabelsSectionHooks from './NewTaskDrawer.LabelsSection.Hooks';

const LabelsSection = ({ isInbox, selectedTaskIdentifier }) => {
  const { labels } = initializeLabelsSectionHooks({
    isInbox,
  });

  const formattedLabels = getFormattedLabels({
    labels,
    selectedTaskIdentifier,
  });

  const [currentlyEditedOption, setCurrentlyEditedOption] = useState(null);

  const [forceOpen, enableForceOpen, disableForceOpen] = useBoolean(true);

  return (
    <SelectInput
      name="labels"
      label="Labels"
      placeholder="Are there labels you'd like to add?"
      multiple
      key={selectedTaskIdentifier ?? 'null'}
      noOptionsText={
        <RobotoTypography condensed variant="h4" color="inherit">
          No labels found
        </RobotoTypography>
      }
      renderItem={option => (
        <EditableLabel
          option={option}
          isInbox={isInbox}
          currentlyEditedOption={currentlyEditedOption}
          setCurrentlyEditedOption={setCurrentlyEditedOption}
          enableForceOpen={enableForceOpen}
          disableForceOpen={disableForceOpen}
        />
      )}
      // getOptionDisabled={option => {
      //   return false;
      // }}
      InputProps={{
        onBlur: event => {
          if (forceOpen) {
            // TODO need to override inputPropsProp.onBlur for InputBase
            throw 'cancelled';
          }
        },
      }}
      endAdornment
    >
      {formattedLabels}
    </SelectInput>
  );
};

export default LabelsSection;
