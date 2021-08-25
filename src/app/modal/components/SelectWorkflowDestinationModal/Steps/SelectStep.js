import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useBoolean from 'hooks/useBoolean';
import {
  getTemplates,
  getTemplatesForSpecificFolder,
} from 'api/task-template-api';
import { remove } from 'ramda';
import * as TaskTemplateApi from 'api/task-template-api';
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

const SelectStep = ({
  selectedFolder,
  setSelectedFolder,
  onAddFolderCallback,
}) => {
  const addFolderReference = useRef(null);
  const [isFetchingFolders, setIsFetchingFolders] = useState(true);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [foldersList, setFoldersList] = useState([]);
  const [listId, setListId] = useState(null);
  const [breadcrumbsIdList, setBreadcrumbsIdList] = useState([]);
  const [
    groupInputFocused,
    setFolderInputFocused,
    unsetFolderInputFocused,
  ] = useBoolean(false);

  const handleAddNewFolder = name => {
    if (!isAddingFolder) {
      setIsAddingFolder(true);
      TaskTemplateApi.addTemplate({ name, type: 'FOLDER' }, listId)
        .then(createdFolder => {
          setFoldersList([...foldersList, createdFolder]);
          onAddFolderCallback(
            createdFolder.parentTaskTemplateIdentifier
              ? createdFolder
              : { ...createdFolder, parentTaskTemplateIdentifier: null },
          );
          setIsAddingFolder(false);
          addFolderReference.current.value = '';
        })
        .catch(() => {
          setIsAddingFolder(false);
        });
    }
  };

  const pushToBreadcrumbsList = useCallback(
    id => {
      setBreadcrumbsIdList([...breadcrumbsIdList, id]);
    },
    [setBreadcrumbsIdList, breadcrumbsIdList],
  );

  const removeLastFromBreadcrumbsList = useCallback(() => {
    setBreadcrumbsIdList([
      ...remove(breadcrumbsIdList.length - 1, 1, breadcrumbsIdList),
    ]);
  }, [setBreadcrumbsIdList, breadcrumbsIdList]);

  const clearBreadcrumbsList = () => {
    setBreadcrumbsIdList([]);
  };

  const getRootList = useCallback(() => {
    clearBreadcrumbsList();
    setIsFetchingFolders(true);
    setListId(null);
    getTemplates()
      .then(folders => {
        setFoldersList(folders.filter(({ type }) => type === 'FOLDER'));
        setIsFetchingFolders(false);
      })
      .catch(() => {
        setIsFetchingFolders(false);
      });
  }, []);

  useEffect(getRootList, [getRootList]);

  const fetchChildList = useCallback(
    taskTemplateIdentifier => {
      setIsFetchingFolders(true);
      setListId(taskTemplateIdentifier);
      pushToBreadcrumbsList(taskTemplateIdentifier);
      getTemplatesForSpecificFolder(taskTemplateIdentifier)
        .then(folders => {
          setFoldersList(folders.filter(({ type }) => type === 'FOLDER'));
          setIsFetchingFolders(false);
        })
        .catch(() => {
          setIsFetchingFolders(false);
        });
    },
    [pushToBreadcrumbsList],
  );

  const backToParentList = useCallback(() => {
    if (breadcrumbsIdList.length > 1) {
      const previousId = breadcrumbsIdList[breadcrumbsIdList.length - 2];
      fetchChildList(previousId);
      removeLastFromBreadcrumbsList();
    } else {
      getRootList();
    }
  }, [
    breadcrumbsIdList,
    removeLastFromBreadcrumbsList,
    fetchChildList,
    getRootList,
  ]);

  const handleGoToFolder = useCallback(
    taskTemplateIdentifier => {
      fetchChildList(taskTemplateIdentifier);
    },
    [fetchChildList],
  );

  return (
    <Step>
      <>
        <TitleWithButtonWrapper isRoot={!listId}>
          {listId && (
            <button type="button" onClick={backToParentList}>
              <ArrowBackIcon />
            </button>
          )}
          <Title>Select a folder</Title>
        </TitleWithButtonWrapper>
        <Box m={1} />
        <ListsWrapper>
          {!isFetchingFolders && (
            <>
              {foldersList?.length > 0 ? (
                foldersList.map(folder => (
                  <ListItem
                    key={folder.taskTemplateIdentifier}
                    isSelected={
                      selectedFolder === folder.taskTemplateIdentifier
                    }
                  >
                    <ListItemTextButton
                      onClick={() =>
                        setSelectedFolder(folder.taskTemplateIdentifier)
                      }
                      type="button"
                      isSelected
                    >
                      {folder.name}
                    </ListItemTextButton>
                    <IconButton
                      onClick={() =>
                        handleGoToFolder(folder.taskTemplateIdentifier)
                      }
                    >
                      <NextArrow />
                    </IconButton>
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
            ref={addFolderReference}
            type="text"
            placeholder="Add folder"
            onFocus={setFolderInputFocused}
            onBlur={unsetFolderInputFocused}
            disabled={isAddingFolder}
            onKeyDown={event =>
              event.key === 'Enter' && handleAddNewFolder(event.target.value)
            }
          />
        </QuickAddInputWrapper>
      </>
    </Step>
  );
};

export default SelectStep;
