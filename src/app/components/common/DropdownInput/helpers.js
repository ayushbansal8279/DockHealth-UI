/* eslint-disable import/prefer-default-export */
import React from 'react';
import { SelectOption } from './styled';

export function generateSelectOptions(options, sortEnabled) {
  if (sortEnabled) {
    return options
      .sort((a, b) => a.label?.localeCompare(b.label))
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
  // eslint-disable-next-line sonarjs/no-identical-functions
  return options.map(({ value, label }) => {
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
