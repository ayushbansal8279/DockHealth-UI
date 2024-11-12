/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import {
  getGroupsForTaskList,
  createGroupAssignedToList,
} from 'api/task-group-list-api';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import {
  ListItem,
  EmptyMessage,
  ListsWrapper,
  QuickAddInput,
  QuickAddInputWrapper,
  ListItemTextButton,
} from '../../SelectDestinationGroupModal/styled';
import { Box, Step } from '@mui/material';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';

const GroupPicker = ({
  selectedList,
  selectedGroup,
  setSelectedGroup,
  onCreateGroup,
}) => {
  const container = useRef(null);
  const addGroupReference = useRef(null);
  const [isFetchingGroups, setIsFetchingGroups] = useState(true);
  const [groups, setGroups] = useState(null);
  const [savingGroup, setSavingGroup] = useState(false);
  const [groupInputFocused, setGroupInputFocused, unsetGroupInputFocused] =
    useBoolean(false);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const defaultGroupNameItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'content.label.default.group',
    ) || {};

  const handleAddNewGroup = (groupName) => {
    if (savingGroup || !selectedList || !groupName) return;
    setSavingGroup(true);
    createGroupAssignedToList({
      taskListIdentifier: selectedList?.taskListIdentifier,
      groupName,
    })
      .then((createdGroup) => {
        if (typeof onCreateGroup === 'function') onCreateGroup(createdGroup);
        setSavingGroup(false);
        setGroups((previousGroups) =>
          setGroups([...previousGroups, createdGroup]),
        );
        setSelectedGroup(createdGroup);
        addGroupReference.current.value = '';
        container.current.scrollTop = container.current.scrollHeight;
      })
      .catch(() => {
        setSavingGroup(false);
      });
  };

  useEffect(() => {
    if (selectedList?.taskListIdentifier) {
      setIsFetchingGroups(true);
      setGroups(null);
      getGroupsForTaskList(selectedList.taskListIdentifier)
        .then((responseGroups) => {
          setGroups(responseGroups);
          setIsFetchingGroups(false);
        })
        .catch(() => {
          setIsFetchingGroups(false);
        });
    }
  }, [selectedList]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredGroupList = groups?.filter((group) => 
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Step>
      {selectedList && (
        <><Box sx={{ width: '100%', mx: 'auto' }}>
            <HeaderSearch  onChange={(value) => setSearchQuery(value)} />
          </Box>
          <Box m={1} />
          <ListsWrapper ref={container}>
            {!isFetchingGroups && (
              <>
                {filteredGroupList?.length > 0 ? (
                  filteredGroupList.map((group) => (
                    <ListItem
                      key={group.taskGroupIdentifier}
                      isSelected={
                        selectedGroup?.taskGroupIdentifier ===
                        group.taskGroupIdentifier
                      }
                    >
                      <ListItemTextButton
                        onClick={() => setSelectedGroup(group)}
                        type="button"
                        isSelected={
                          selectedGroup?.taskGroupIdentifier ===
                          group.taskGroupIdentifier
                        }
                      >
                        {group.groupName === 'DEFAULT'
                          ? defaultGroupNameItem?.value || 'New tasks'
                          : group.groupName}
                      </ListItemTextButton>
                    </ListItem>
                  ))
                ) : (
                  <EmptyMessage>List is empty</EmptyMessage>
                )}
              </>
            )}
          </ListsWrapper>
          <QuickAddInputWrapper isFocused={groupInputFocused}>
            <QuickAddInput
              ref={addGroupReference}
              type="text"
              placeholder="Add group"
              onFocus={setGroupInputFocused}
              onBlur={unsetGroupInputFocused}
              disabled={savingGroup || isFetchingGroups}
              onKeyDown={(event) =>
                event.key === 'Enter' && handleAddNewGroup(event.target.value)
              }
            />
          </QuickAddInputWrapper>
        </>
      )}
    </Step>
  );
};

export default GroupPicker;
