import React from 'react';
import { RobotoTypography } from 'styles/theme';

export const getFormattedLabel = (label) => {
  const { labelIdentifier, labelName } = label;
  return {
    key: labelIdentifier,
    value: labelIdentifier,
    label: (
      <RobotoTypography condensed variant="h4">
        {labelName}
      </RobotoTypography>
    ),
    displayLabel: labelName,
  };
};

export const getFormattedLabels = ({ labels }) =>
  (labels ?? []).map((label) => getFormattedLabel(label));
