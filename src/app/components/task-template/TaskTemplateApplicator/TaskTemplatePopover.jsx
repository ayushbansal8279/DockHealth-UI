import React, { useMemo, useCallback } from 'react';
import { Popover } from '@material-ui/core';
import Search from 'components/task-view/Search/Search';
import Folder from 'img/folder';
import ArrowLeftIcon from 'img/arrow-left.svg';
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
} from './styled';

const TaskTemplatePopover = ({
  anchorEl,
  taskTemplatesList = [],
  taskTemplatesIsLoading,
  open,
  onClose,
  searchPhrase,
  onSearchChange,
  onFolderClick,
  onTemplateSelect,
  getTemplatesList,
  parentList,
  onBack,
}) => {
  const folders = useMemo(
    () => taskTemplatesList?.filter(({ type }) => type === 'FOLDER'),
    [taskTemplatesList],
  );
  const templates = useMemo(
    () => taskTemplatesList?.filter(({ type }) => type !== 'FOLDER'),
    [taskTemplatesList],
  );

  const renderTemplate = useCallback(
    folder => {
      const { taskTemplateIdentifier, name } = folder;

      return (
        <Item
          onClick={() => onTemplateSelect(folder)}
          key={taskTemplateIdentifier}
        >
          {name}
        </Item>
      );
    },
    [onTemplateSelect],
  );

  const renderFolder = useCallback(
    folder => {
      const { taskTemplateIdentifier, name } = folder;
      return (
        <ListItem key={taskTemplateIdentifier}>
          <FolderIconContainer>
            <FolderIcon src={Folder} alt="folder icon" />
          </FolderIconContainer>
          <ListItemTextButton
            onClick={() => onFolderClick(folder)}
            type="button"
          >
            {name}
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
          width: 325,
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
      <SearchContainer>
        <Search
          fullWidth
          noBackground
          value={searchPhrase}
          onChange={event => onSearchChange(event?.target?.value)}
          placeholder="Search Workflows"
        />
      </SearchContainer>
      {parentList && (
        <PopoverHeader>
          <BackIconContainer onClick={onBack}>
            <img src={ArrowLeftIcon} alt="back-navigation" />
          </BackIconContainer>
          <HeaderTextContainer>
            {trunc(parentList.name, 25)}
          </HeaderTextContainer>
        </PopoverHeader>
      )}
      <SelectOptionsContainer>
        {taskTemplatesIsLoading && (
          <LoaderContainer>
            <LoaderItem />
            <LoaderItem />
            <LoaderItem />
          </LoaderContainer>
        )}
        {!taskTemplatesIsLoading &&
          folders?.length > 0 &&
          folders.map(folder => renderFolder(folder))}
        {!taskTemplatesIsLoading &&
          templates?.length > 0 &&
          templates.map(folder => renderTemplate(folder))}
        {!taskTemplatesIsLoading && taskTemplatesList?.length === 0 && (
          <EmptyLabel>There are no workflows to select from</EmptyLabel>
        )}
      </SelectOptionsContainer>
    </Popover>
  );
};

export default TaskTemplatePopover;
