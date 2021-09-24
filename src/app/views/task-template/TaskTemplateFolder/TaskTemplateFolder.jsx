/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import palette from 'styles/palette';
import { MoreHoriz } from '@material-ui/icons';
import * as TaskTemplateActions from 'actions/task-template-actions';
import * as ModalActions from 'modal/actions';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import Folder from 'img/folder';
import {
  TaskTemplateContainer,
  TaskTemplateHeader,
  NameInput,
  HeaderChildrenContainer,
  FolderIcon,
  MenuContainer,
  FolderIconContainer,
} from './styled';

const TaskTemplateFolder = ({ template, children, onClick }) => {
  const { taskTemplateIdentifier, name } = template;

  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const [nameInputError, setNameInputError] = useState(false);
  const nameInputReference = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setNameInputValue(name);
    // eslint-disable-next-line no-unused-expressions
    nameInputReference.current?.blur();
  }, [name]);

  const menuOptions = useMemo(
    () => [
      {
        name: 'Edit Folder Name',
        onClick: () => {
          setIsEditing(true);
          // eslint-disable-next-line no-unused-expressions
          nameInputReference.current?.focus();
        },
      },
      {
        name: 'Delete Folder',
        color: palette.oPlusRed,
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete folder',
              description:
                'Are you sure you want to delete this folder? This action cannot be undone.',
              confirm: () =>
                dispatch(
                  TaskTemplateActions.deleteTemplate(taskTemplateIdentifier),
                ),
            }),
          ),
      },
    ],
    [taskTemplateIdentifier, dispatch, nameInputReference],
  );

  const handleNameInputKeyDown = useCallback(
    event => {
      const {
        key,
        target: { value },
      } = event;
      if (key === 'Enter') {
        if (value?.length > 1) {
          setNameInputError(false);
          dispatch(
            TaskTemplateActions.updateTemplate(taskTemplateIdentifier, {
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
    [dispatch, taskTemplateIdentifier],
  );

  const onChangeName = event => {
    setNameInputValue(event.target?.value);
    setNameInputError(false);
  };

  const onBlurName = () => {
    setIsEditing(false);
    setNameInputValue(name);
  };

  return (
    <TaskTemplateContainer>
      <TaskTemplateHeader>
        <FolderIconContainer>
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
        <OptionsMenu options={menuOptions}>
          <MenuContainer size="small">
            <MoreHoriz fontSize="large" color="inherit" />
          </MenuContainer>
        </OptionsMenu>
      </TaskTemplateHeader>
    </TaskTemplateContainer>
  );
};

export default TaskTemplateFolder;
