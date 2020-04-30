import React from 'react';

import { RobotoTypography } from 'styles/theme';

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
    >
      {formattedLabels}
    </SelectInput>
  );
};

export default LabelsSection;
