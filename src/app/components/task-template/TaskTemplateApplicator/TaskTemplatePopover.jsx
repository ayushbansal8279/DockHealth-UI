import React, { useMemo, useCallback, useEffect } from 'react';
import { Popover } from '@mui/material';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import Search from 'components/task-view/Search/Search';
import Folder from 'img/folder.svg';
import NewWorkflowFolder from 'img/new-workflow-folder-icon.svg';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import { trunc } from 'helpers/utility-functions';
import {
  Item,
  LoaderItem,
  LoaderContainer,
  EmptyLabel,
  ListItem,
  ListItemTextButton,
  NextArrow,
  SelectOptionsContainer,
  SearchContainer,
  FolderIcon,
  FolderIconContainer,
  PopoverHeader,
  BackIconContainer,
  HeaderTextContainer,
  WorkflowFoldersContainer,
  WorkflowFoldersHeaderContainer,
  WorkflowFoldersHeaderLabel,
  WorkflowFoldersListContainer,
  FolderNameContainer,
  WorkflowSearchHorizontalLineContainer,
  WorkflowSearchHorizontalLine,
  WorkflowListsContainer,
  WorkflowLists,
  WorkflowNameContainer,
} from './styled';

const TaskTemplatePopover = ({
  anchorEl,
  taskTemplatesList = [],
  taskTemplatesIsLoading,
  open,
  onClose,
  searchPhrase = '',
  onSearchChange,
  onFolderClick,
  onTemplateSelect,
  getTemplatesList,
  parentList,
  onBack,
  isWorkflowSearch,
}) => {
  const folders = useMemo(
    () =>
      taskTemplatesList?.filter(
        ({ templateType }) => templateType === 'FOLDER',
      ),
    [taskTemplatesList],
  );
  const templates = useMemo(
    () =>
      taskTemplatesList?.filter(
        ({ templateType }) => templateType !== 'FOLDER',
      ),
    [taskTemplatesList],
  );

  useEffect(() => {
    if (!open && searchPhrase !== '') onSearchChange('');
  }, [onSearchChange, open, searchPhrase]);

  const renderTemplate = useCallback(
    (folder) => {
      const { taskTemplateIdentifier, name } = folder;

      return (
        <Item
          onClick={() => onTemplateSelect(folder)}
          key={taskTemplateIdentifier}
        >
          <WorkflowNameContainer>{name}</WorkflowNameContainer>
        </Item>
      );
    },
    [onTemplateSelect],
  );

  const renderFolder = useCallback(
    (folder) => {
      const { taskTemplateIdentifier, name } = folder;
      return (
        <ListItem key={taskTemplateIdentifier}>
          <FolderIconContainer>
            <FolderIcon src={NewWorkflowFolder} alt="folder icon" />
          </FolderIconContainer>
          <ListItemTextButton
            onClick={() => onFolderClick(folder)}
            type="button"
          >
            <FolderNameContainer>{name}</FolderNameContainer>
          </ListItemTextButton>
          <NextArrow onClick={() => onFolderClick(folder)} />
        </ListItem>
      );
    },
    [onFolderClick],
  );

  return (
    <Popover
      PaperProps={{
        style: {
          width: 317,
          borderRadius: '7px 7px 0px 0px',
          overflowY: 'hidden',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      open={open}
      onEnter={getTemplatesList}
      onClose={onClose}
    >
      <SearchContainer isWorkFlowSearch={isWorkflowSearch}>
        <Search
          fullWidth
          noBackground
          value={searchPhrase}
          onChange={(event) => onSearchChange(event?.target?.value)}
          placeholder="Search"
          isWorkFlowSearch={isWorkflowSearch}
        />
      </SearchContainer>
      <WorkflowSearchHorizontalLineContainer>
        <WorkflowSearchHorizontalLine />
      </WorkflowSearchHorizontalLineContainer>
      {parentList && (
        <>
          <PopoverHeader onClick={onBack}>
            <BackIconContainer>
              <ChevronLeftSharpIcon
                fontSize="large"
                sx={{ color: '#4BB3FD' }}
              />
              {/* <img src={ArrowLeftIcon} alt="back-navigation" /> */}
            </BackIconContainer>
            <HeaderTextContainer>
              Back
              {/* {trunc(parentList.name, 25)} */}
            </HeaderTextContainer>
          </PopoverHeader>
          <WorkflowSearchHorizontalLineContainer>
            <WorkflowSearchHorizontalLine />
          </WorkflowSearchHorizontalLineContainer>
        </>
      )}
      <SelectOptionsContainer>
        {taskTemplatesIsLoading && (
          <LoaderContainer>
            <LoaderItem />
            <LoaderItem />
            <LoaderItem />
          </LoaderContainer>
        )}
        {folders?.length > 0 && (
          <>
            <WorkflowFoldersContainer>
              <WorkflowFoldersHeaderContainer>
                <WorkflowFoldersHeaderLabel>Folders</WorkflowFoldersHeaderLabel>
              </WorkflowFoldersHeaderContainer>
              <WorkflowFoldersListContainer>
                {!taskTemplatesIsLoading &&
                  folders?.length > 0 &&
                  folders
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((folder) => renderFolder(folder))}
              </WorkflowFoldersListContainer>
            </WorkflowFoldersContainer>
            <WorkflowSearchHorizontalLineContainer>
              <WorkflowSearchHorizontalLine />
            </WorkflowSearchHorizontalLineContainer>
          </>
        )}
        <WorkflowListsContainer>
          <WorkflowLists>
            {!taskTemplatesIsLoading &&
              templates?.length > 0 &&
              templates
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((folder) => renderTemplate(folder))}
            {!taskTemplatesIsLoading && taskTemplatesList?.length === 0 && (
              <EmptyLabel>There are no workflows to select from</EmptyLabel>
            )}
          </WorkflowLists>
        </WorkflowListsContainer>
      </SelectOptionsContainer>
    </Popover>
  );
};

export default TaskTemplatePopover;
