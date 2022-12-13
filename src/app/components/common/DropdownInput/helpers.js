/* eslint-disable import/prefer-default-export */
import React from 'react';
import { SelectOption } from './styled';

export function generateSelectOptions(options) {
  return options
    .sort((a, b) => a.localeCompare(b))
    .map(({ value, label }) => {
      return {
        key: value,
        label: isHovered => (
          <SelectOption isActive={isHovered}>{label}</SelectOption>
        ),
        value,
        displayLabel: label,
      };
    });
}
