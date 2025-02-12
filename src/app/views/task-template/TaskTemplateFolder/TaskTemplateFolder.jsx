/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import palette from 'styles/palette';
import { MoreVert } from '@mui/icons-material';
import { userProfileSelector } from 'selectors/user-selectors';
import * as WorkflowActions from 'actions/workflow-actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import * as ModalActions from 'modal/actions';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import Folder from 'img/folder.svg';
import {
  TaskTemplateContainer,
  TaskTemplateHeader,
  NameInput,
  HeaderChildrenContainer,
  FolderIcon,
  FolderIconContainer,
} from './styled';

const TaskTemplateFolder = ({
  template,
  children,
  onClick,
  highlighted = false,
}) => {
  const { identifier, name, publicAccess = false, members } = template;
  const currentUser = useSelector(userProfileSelector);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);

  const isCurrentUserEditor =
    members?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'EDITOR';

  const dispatch = useDispatch();

  useEffect(() => {
    setNameInputValue(name);
    // eslint-disable-next-line no-unused-expressions
    nameInputReference.current?.blur();
  }, [name]);

  useEffect(() => {
    if (nameInputReference?.current && highlighted) {
      nameInputReference.current.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
    }
  }, [highlighted, nameInputReference]);

  const menuOptions = useMemo(
    () => [
      isCurrentUserEditor && {
        name: 'Edit Folder Name',
        onClick: () => {
          setIsEditing(true);
          // eslint-disable-next-line no-unused-expressions
          nameInputReference.current?.focus();
        },
      },
      isCurrentUserEditor && {
        name: publicAccess ? 'Make Private' : 'Make Public',
        onClick: () => {
          dispatch(
            TaskTemplateActions.switchTemplatePublic(identifier, !publicAccess),
          );
        },
      },
      isCurrentUserEditor && {
        name: 'Delete Folder',
        color: palette.oPlusRed,
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete folder',
              description:
                'Are you sure you want to delete this folder? This action cannot be undone.',
              confirm: () => {
                dispatch(WorkflowActions.deleteWorkflow(identifier));
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
      isCurrentUserEditor && {
        name: 'Copy to another organization',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectOrganization', {
              confirmText: 'Copy',
              confirm: (selectedItems) => {
                dispatch(
                  TaskTemplateActions.copyWorkflowToOrganization(
                    identifier,
                    selectedItems?.organizations,
                  ),
                );
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
      },
    ],
    [
      identifier,
      dispatch,
      nameInputReference,
      publicAccess,
      isCurrentUserEditor,
    ],
  );

  const handleNameInputKeyDown = useCallback(
    (event) => {
      const {
        key,
        target: { value },
      } = event;
      if (key === 'Enter') {
        if (value?.length > 1) {
          setNameInputError(false);
          dispatch(
            TaskTemplateActions.updatePartialWorkflow(identifier, {
              name: value,
            }),
          );
        } else {
          setNameInputError(true);
        }
      } else if (key === 'Escape') {
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, identifier],
  );

  const onChangeName = (event) => {
    setNameInputValue(event.target?.value);
    setNameInputError(false);
  };

  const onBlurName = () => {
    setIsEditing(false);
    setNameInputValue(name);
  };

  return (
    <TaskTemplateContainer highlighted={highlighted}>
      <TaskTemplateHeader>
        <FolderIconContainer>
          <OptionsMenu
            isDisabled={menuOptions?.length === 0}
            options={menuOptions}
          >
            <MoreVert color="primary" />
          </OptionsMenu>
          <FolderIcon src={Folder} alt="folder icon" />
        </FolderIconContainer>
        <NameInput
          ref={nameInputReference}
          readOnly={!isEditing}
          error={nameInputError}
          onChange={onChangeName}
          onBlur={onBlurName}
          onKeyDown={handleNameInputKeyDown}
          value={nameInputValue}
          onClick={onClick}
        />
        <HeaderChildrenContainer>{children}</HeaderChildrenContainer>
      </TaskTemplateHeader>
    </TaskTemplateContainer>
  );
};

export default TaskTemplateFolder;
