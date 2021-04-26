import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useBoolean from 'hooks/useBoolean';
import {
  getGroupsForTaskList,
  createGroupAssignedToList,
} from 'api/task-group-list-api';
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

const GroupSelectStep = ({
  selectedList,
  setSelectedList,
  selectedGroup,
  setSelectedGroup,
  setPreviousStep,
  selectParentTask,
  setNextStep,
}) => {
  const addGroupReference = useRef(null);
  const [isFetchingGroups, setIsFetchingGroups] = useState(true);
  const [groups, setGroups] = useState(null);
  const [savingGroup, setSavingGroup] = useState(false);
  const [
    groupInputFocused,
    setGroupInputFocused,
    unsetGroupInputFocused,
  ] = useBoolean(false);

  const handleAddNewGroup = groupName => {
    if (savingGroup || !selectedList || !groupName) return;

    setSavingGroup(true);
    createGroupAssignedToList({
      taskListIdentifier: selectedList?.taskListIdentifier,
      groupName,
    })
      .then(createdGroup => {
        setSavingGroup(false);
        setGroups(previousGroups =>
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
        .then(responseGroups => {
          setGroups(responseGroups);
          setIsFetchingGroups(false);
        })
        .catch(() => {
          setIsFetchingGroups(false);
        });
    }
  }, [selectedList]);

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
              <ArrowBackIcon />
            </button>
            <Title>{selectedList.listName}</Title>
          </TitleWithButtonWrapper>
          <Box m={1} />
          <ListsWrapper>
            {!isFetchingGroups && (
              <>
                {groups?.length > 0 ? (
                  groups.map(group => (
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
                          ? 'New tasks'
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
              onKeyDown={event =>
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
