import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import props from 'ramda/es/props';

import useBoolean from '../../hooks/useBoolean';
import PickerHeader from '../common/PickerHeader';
import SearchHeader from '../common/SearchHeader';

const HeaderTaskName = styled.span`
  text-decoration: underline;
`;

const captureClicks = e => e.stopPropagation();

const renderHeader = ({ handleClose, handleSearchToggle, task }) => {
  return (
    <PickerHeader
      handleClose={handleClose}
      handleSearchToggle={handleSearchToggle}
      closeLabel="Close user selection"
    >
      {'Assign to '}
      <HeaderTaskName>{task?.description ?? 'new task'}</HeaderTaskName>
    </PickerHeader>
  );
};

const renderSearchHeader = ({ handleSearch, handleSearchToggle }) => (
  <SearchHeader
    handleSearch={handleSearch}
    handleSearchToggle={handleSearchToggle}
  />
);

export default ({
  anchorEl,
  closePopover,
  currentItem,
  items,
  itemComparisonKey,
  itemFilterPropertyKeys,
  open,
  onPersonClick,
  renderItem,
}) => {
  const [isSearching, , , toggleIsSearching] = useBoolean(false);
  const [searchTerm, setSearchTerm] = useState('');
  const task = useSelector(store => store.taskState.selectedTask);

  const handleSearchToggle = () => {
    toggleIsSearching();
    setSearchTerm('');
  };

  const headerParams = {
    handleClose: closePopover,
    handleSearch: e => setSearchTerm(e?.target?.value),
    handleSearchToggle,
    searchTerm,
    task,
  };

  const filteredItems = items.filter(item => {
    const properties = props(itemFilterPropertyKeys, item);

    return properties.some(property =>
      property?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  return (
    <Popover
      onClick={captureClicks}
      open={open}
      anchorEl={anchorEl?.current}
      onClose={closePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {isSearching
        ? renderSearchHeader(headerParams)
        : renderHeader(headerParams)}
      <List>
        <ListItem selected={currentItem == null} onClick={onPersonClick(null)}>
          {renderItem(null)}
        </ListItem>
        {filteredItems?.map(item => (
          <ListItem
            key={item?.[itemComparisonKey]}
            selected={
              item?.[itemComparisonKey] === currentItem?.[itemComparisonKey]
            }
            onClick={onPersonClick(item)}
          >
            {renderItem(item)}
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};
