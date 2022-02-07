/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cleanClickFilter } from 'actions/mega-filter-actions';
import { useDispatch } from 'react-redux';
import { compose } from 'ramda';
import CustomFilterOption from '../CustomFilterOption/CustomFilterOption';
import { CustomFiltersContainer, Label, OptionsList } from './styled';
import { getUniqueQuickFilterLabelName } from './helpers';

const CustomFilters = ({
  quickFiltersList = [],
  addQuickFilterOption,
  selectedQuickFilter: selected,
  selectQuickFilter: setSelected,
  onCreate,
  onUpdate,
  onDelete,
  editModeEnabled = false,
}) => {
  const [editModeFilterIdentifier, setEditModeFilterIdentifier] = useState(
    null,
  );
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const unlisten = history.listen(compose(dispatch, cleanClickFilter));

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback(
    (_, identifier, { filters }) => {
      if (editModeEnabled && selected === identifier) {
        const originalFiltersList = quickFiltersList.find(
          f => f.key === identifier,
        )?.filters;

        setSelected(identifier, originalFiltersList);
      } else if (selected === identifier) {
        setSelected(null);
      } else {
        setSelected(identifier, filters);
      }
    },
    [editModeEnabled, quickFiltersList, selected, setSelected],
  );

  const handleUpdate = useCallback(
    (identifier, name) => {
      setEditModeFilterIdentifier(null);
      if (typeof onUpdate === 'function') onUpdate(identifier, name);
    },
    [onUpdate],
  );

  const handleCreate = useCallback(
    (_, name) => {
      setEditModeFilterIdentifier(null);
      if (typeof onCreate === 'function') onCreate(name);
    },
    [onCreate],
  );

  if (
    (!quickFiltersList || quickFiltersList.length === 0) &&
    !addQuickFilterOption
  )
    return null;

  return (
    <CustomFiltersContainer>
      <Label>Quick Filters</Label>
      <OptionsList>
        {addQuickFilterOption && (
          <CustomFilterOption
            label={getUniqueQuickFilterLabelName(quickFiltersList)}
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
            onOptionClick={event => handleSelect(event, filter.key, filter)}
            onEditMode={identifier => setEditModeFilterIdentifier(identifier)}
            disabled={filter.key !== editModeFilterIdentifier}
            onBlur={handleUpdate}
            editModeEnabled={editModeEnabled}
            onDelete={onDelete}
          />
        ))}
      </OptionsList>
    </CustomFiltersContainer>
  );
};

export default CustomFilters;
