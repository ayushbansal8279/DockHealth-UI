/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cleanClickFilter } from 'actions/mega-filter-actions';
import { useDispatch } from 'react-redux';
import compose from 'ramda/src/compose';
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
  setFinalFilter,
  filters,
  setMenuOption,
  setSavePopupOpen,
  setQuickFilterIdentifier,
}) => {
  const [editModeFilterIdentifier, setEditModeFilterIdentifier] =
    useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('')

  useEffect(() => {
    const unlisten = history.listen(compose(dispatch, cleanClickFilter));

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback(
    (_, identifier, { selectedOptions }) => {
      // if (editModeEnabled && selected === identifier) {
        // const originalFiltersList = quickFiltersList.find(
        //   (f) => f.quickFilterIdentifier === identifier,
        // )?.selectedOptions;

        // setSelected(identifier, originalFiltersList);
      // } else if (selected === identifier) {
      //   setSelected(null);
      // } else {
      //   setSelected(identifier, selectedOptions);
      // }
      // setSelected(identifier, originalFiltersList);
      setSelectedQuickFilter(identifier);
      setQuickFilterIdentifier(identifier);
      const data = {};
      for (const key in selectedOptions) {
        const users = filters
          .flatMap((item) => item.id === key && item.options)
          .filter((item) => typeof item !== 'boolean');
        data[key] = selectedOptions[key].options.map((item) =>
          users.find((user) => user.key === item),
        );
      }
      setFinalFilter(data);
    },
    [editModeEnabled, quickFiltersList, selectedQuickFilter, setSelectedQuickFilter],
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
        {quickFiltersList.map((filter) => (
          <CustomFilterOption
            label={filter.name}
            key={filter.quickFilterIdentifier}
            identifier={filter.quickFilterIdentifier}
            selectedQuickFilter={selectedQuickFilter}
            setSelectedQuickFilter={setSelectedQuickFilter}
            onOptionClick={(event) =>
              handleSelect(event, filter.quickFilterIdentifier, filter)
            }
            onEditMode={(identifier) => setEditModeFilterIdentifier(identifier)}
            disabled={filter.quickFilterIdentifier !== editModeFilterIdentifier}
            onBlur={handleUpdate}
            editModeEnabled={editModeEnabled}
            onDelete={onDelete}
            setQuickFilterIdentifier={setQuickFilterIdentifier}
            setSavePopupOpen={setSavePopupOpen}
            setFinalFilter={setFinalFilter}
          />
        ))}
      </OptionsList>
    </CustomFiltersContainer>
  );
};

export default CustomFilters;
