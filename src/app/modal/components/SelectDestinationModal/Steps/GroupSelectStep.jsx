import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBoolean } from 'hooks/useBoolean';
import {
  getGroupsForTaskList,
  createGroupAssignedToList,
} from 'api/task-group-list-api';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import {
  TitleWithButtonWrapper,
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  QuickAddInput,
  QuickAddInputWrapper,
  ListItemTextButton,
  Step,
  NextArrow,
} from '../styled';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';

const GroupSelectStep = ({
  selectedList,
  setSelectedList,
  selectedGroup,
  setSelectedGroup,
  setPreviousStep,
  selectParentTask,
  setNextStep,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
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
        setSavingGroup(false);
        setGroups((previousGroups) =>
          setGroups([...previousGroups, createdGroup]),
        );
        addGroupReference.current.value = '';
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
        <>
          <TitleWithButtonWrapper>
            <button
              type="button"
              onClick={() => {
                setPreviousStep();
                setSelectedList(null);
                setSelectedGroup(null);
              }}
            >
              <ArrowBackIcon color='warning'/>
            </button>
            <Title>{selectedList.listName}</Title>
          </TitleWithButtonWrapper>
          <Box m={1} />
          <Box sx={{ width: '100%', mx: 'auto' }}>
            <HeaderSearch onChange={(value) => setSearchQuery(value)} />
          </Box>
          <Box m={.5} />
          <ListsWrapper>
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
                      {selectParentTask && (
                        <IconButton
                          onClick={() => {
                            setSelectedGroup(group);
                            setNextStep();
                          }}
                        >
                          <NextArrow />
                        </IconButton>
                      )}
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

export default GroupSelectStep;
