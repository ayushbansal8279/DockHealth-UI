import React from 'react';
import { OutfitTypography } from 'styles/theme';

export const getFormattedLabel = (label) => {
  const { labelIdentifier, labelName } = label;
  return {
    key: labelIdentifier,
    value: labelIdentifier,
    label: (
      <OutfitTypography condensed variant="h4">
        {labelName}
      </OutfitTypography>
    ),
    displayLabel: labelName,
  };
};

export const getFormattedLabels = ({ labels }) =>
  (labels ?? []).map((label) => getFormattedLabel(label));
