/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import CustomFilterOption from '../CustomFilterOption/CustomFilterOption';
import { CustomFiltersContainer, Label, OptionsList } from './styled';
import { getUniqueQuickFilterLabelName } from './helpers';

const CustomFilters = ({
  quickFiltersList,
  addQuickFilterOption,
  selectedQuickFilter: selected,
  selectQuickFilter: setSelected,
  onUpdate,
  onCreate,
  editModeEnabled = false,
}) => {
  const handleSelect = useCallback(
    (identifier, { filters }) => {
      console.log('select:', selected, identifier);
      return selected === identifier
        ? setSelected(null)
        : setSelected(identifier, filters);
    },
    [selected, setSelected],
  );
  const [editModeFilterIdentifier, setEditModeFilterIdentifier] = useState(
    null,
  );

  const handleUpdate = useCallback(
    (identifier, name) => {
      console.log('update:', identifier, name);
      setEditModeFilterIdentifier(null);
      if (typeof onUpdate === 'function') onUpdate(identifier, name);
    },
    [onUpdate],
  );

  const handleCreate = useCallback(
    (identifier, name) => {
      console.log('add:', identifier, name);
      setEditModeFilterIdentifier(null);
      if (typeof onUpdate === 'function') onCreate(name);
    },
    [onCreate, onUpdate],
  );

  return (
    <CustomFiltersContainer>
      <Label>Quick Filters</Label>
      <OptionsList>
        {addQuickFilterOption && (
          <CustomFilterOption
            label={getUniqueQuickFilterLabelName(quickFiltersList)}
            identifier="addSelectOption"
            autofocus
            disableOptions
            disabled={false}
            onBlur={handleCreate}
          />
        )}
        {quickFiltersList.map(filter => (
          <CustomFilterOption
            label={filter.displayValue}
            identifier={filter.key}
            selected={selected === filter.key}
            onOptionClick={() => handleSelect(filter.key, filter)}
            onEditMode={identifier => setEditModeFilterIdentifier(identifier)}
            disabled={filter.key !== editModeFilterIdentifier}
            onBlur={handleUpdate}
            editModeEnabled={editModeEnabled}
          />
        ))}
      </OptionsList>
    </CustomFiltersContainer>
  );
};

export default CustomFilters;
