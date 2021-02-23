import React from 'react';
import { CondensedH4 } from '../NewTaskDrawer.Styled';

export const getFormattedLabel = label => {
  const { labelIdentifier, labelName } = label;
  return {
    key: labelIdentifier,
    value: labelIdentifier,
    label: <CondensedH4>{labelName}</CondensedH4>,
    displayLabel: labelName,
  };
};

export const getFormattedLabels = ({ labels }) =>
  (labels ?? []).map(label => getFormattedLabel(label));
