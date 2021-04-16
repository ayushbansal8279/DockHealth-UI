import React from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@material-ui/core';
import * as ModalActions from 'modal/actions';

import {
  duplicateTemplateBundle,
  moveTemplateBundle,
  deleteTemplateBundle,
} from 'actions/task-template-actions';

import { Item } from './styled';

const TaskTemplateGroupPopover = ({
  anchorEl,
  open,
  onClose,
  templateBundleIdentifier,
  taskGroupIdentifier,
}) => {
  const dispatch = useDispatch();
  return (
    <Popover
      PaperProps={{
        elevation: 0,
        square: true,
        style: {
          width: 190,
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
      onClose={onClose}
    >
      <Item
        onClick={() =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () => {
                dispatch(
                  duplicateTemplateBundle(
                    templateBundleIdentifier,
                    taskGroupIdentifier,
                    true,
                  ),
                );
                onClose();
              },
              skip: () => {
                dispatch(
                  duplicateTemplateBundle(
                    templateBundleIdentifier,
                    taskGroupIdentifier,
                    false,
                  ),
                );
                onClose();
              },
            }),
          )
        }
      >
        Duplicate
      </Item>
      <Item
        onClick={() =>
          dispatch(
            ModalActions.openModal('SelectTemplateBundleDestination', {
              tasksToMove: [],
              confirmText: 'Move',
              confirm: selectedDestination =>
                dispatch(
                  moveTemplateBundle(
                    templateBundleIdentifier,
                    taskGroupIdentifier,
                    selectedDestination,
                  ),
                ),
            }),
          )
        }
      >
        Move
      </Item>
      <Item
        onClick={() =>
          dispatch(
            deleteTemplateBundle(templateBundleIdentifier, taskGroupIdentifier),
          )
        }
      >
        Delete
      </Item>
    </Popover>
  );
};

export default TaskTemplateGroupPopover;
