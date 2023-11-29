import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBoolean } from 'hooks/useBoolean';
import {
  getTemplates,
  getTemplatesForSpecificFolder,
} from 'api/task-template-api';
import remove from 'ramda/src/remove';
import * as TaskTemplateApi from 'api/task-template-api';
import {
  TitleWithButtonWrapper,
  Title,
  EmptyMessage,
  QuickAddInput,
  QuickAddInputWrapper,
  Step,
  ListsWrapper,
  ListItem,
  ListItemTextButton,
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
  const [groupInputFocused, setFolderInputFocused, unsetFolderInputFocused] =
    useBoolean(false);

  const handleAddNewFolder = (name) => {
    if (!isAddingFolder) {
      setIsAddingFolder(true);
      TaskTemplateApi.addTemplate({ name, templateType: 'FOLDER' }, listId)
        .then((createdFolder) => {
          setFoldersList([...foldersList, createdFolder]);
          onAddFolderCallback(
            createdFolder.parentTaskWorkflowIdentifier
              ? createdFolder
              : { ...createdFolder, parentTaskWorkflowIdentifier: null },
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
    (id) => {
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
    getTemplates(false)
      .then((folders) => {
        setFoldersList([
          {
            identifier: undefined,
            name: 'Workflows',
            templateType: 'FOLDER',
            publicAccess: true,
          },
          ...folders.filter(({ templateType }) => templateType === 'FOLDER'),
        ]);
        setIsFetchingFolders(false);
      })
      .catch(() => {
        setIsFetchingFolders(false);
      });
  }, []);

  useEffect(getRootList, [getRootList]);

  const fetchChildList = useCallback(
    (identifier) => {
      setIsFetchingFolders(true);
      setListId(identifier);
      pushToBreadcrumbsList(identifier);
      getTemplatesForSpecificFolder(identifier)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((folders) => {
          setFoldersList(
            folders.filter(({ templateType }) => templateType === 'FOLDER'),
          );
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
    (identifier) => {
      fetchChildList(identifier);
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
                foldersList.map((folder) => (
                  <ListItem
                    key={folder.identifier}
                    isSelected={selectedFolder === folder.identifier}
                  >
                    <ListItemTextButton
                      onClick={() => setSelectedFolder(folder.identifier)}
                      type="button"
                      isSelected
                    >
                      {folder.name}
                    </ListItemTextButton>
                    {folder.identifier && (
                      <IconButton
                        onClick={() => handleGoToFolder(folder.identifier)}
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
            ref={addFolderReference}
            type="text"
            placeholder="Add folder"
            onFocus={setFolderInputFocused}
            onBlur={unsetFolderInputFocused}
            disabled={isAddingFolder}
            onKeyDown={(event) =>
              event.key === 'Enter' && handleAddNewFolder(event.target.value)
            }
          />
        </QuickAddInputWrapper>
      </>
    </Step>
  );
};

export default SelectStep;
