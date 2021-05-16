import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Popover } from '@material-ui/core';
import * as TaskTemplateActions from 'actions/task-template-actions';

import {
  CreateTaskLinkText,
  CreateTaskLinkContainer,
  Item,
  LoaderItem,
  LoaderContainer,
  EmptyLabel,
} from './styled';

const renderTemplateItem = ({ onClick, key, label }) => {
  return (
    <Item onClick={onClick} key={key}>
      {label}
    </Item>
  );
};

const TaskTemplatePopover = ({
  anchorEl,
  taskTemplatesList,
  taskTemplatesIsLoading,
  open,
  onClose,
}) => {
  const dispatch = useDispatch();

  return (
    <Popover
      PaperProps={{
        elevation: 0,
        square: true,
        style: {
          width: 325,
          maxHeight: 400,
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
      onEnter={() => dispatch(TaskTemplateActions.getTemplates())}
      onClose={onClose}
    >
      {taskTemplatesIsLoading && (
        <LoaderContainer>
          <LoaderItem />
          <LoaderItem />
          <LoaderItem />
        </LoaderContainer>
      )}
      {!taskTemplatesIsLoading &&
        taskTemplatesList?.length > 0 &&
        taskTemplatesList.map(renderTemplateItem)}
      {!taskTemplatesIsLoading && taskTemplatesList?.length === 0 && (
        <EmptyLabel>There are no workflows to select from</EmptyLabel>
      )}
      <CreateTaskLinkContainer>
        <Link to="/core/workflows">
          <CreateTaskLinkText>Create New Workflow</CreateTaskLinkText>
        </Link>
      </CreateTaskLinkContainer>
    </Popover>
  );
};

export default TaskTemplatePopover;
