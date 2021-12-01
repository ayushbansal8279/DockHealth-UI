import React, { useEffect, useRef, useState } from 'react';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import initializeAddCommentHooks from './hooks';
import {
  AddCommentContainer,
  AddCommentLoaderContainer,
  AddCommentInputContainer,
} from './styled';

const AddComment = ({
  addComment,
  taskDrawerFocusField,
  taskListIdentifier,
  isTemplateTask,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    currentUser,
    commentState,
    onCommentChange,
    saveComment,
    isAddingComment,
  } = initializeAddCommentHooks({ addComment });

  const addCommentReference = useRef();
  const addCommentContainerReference = useRef();

  useEffect(() => {
    if (
      taskDrawerFocusField === DrawerFieldEnum.COMMENT &&
      addCommentReference?.current
    ) {
      addCommentReference.current.editor.focus();
      // eslint-disable-next-line no-unused-expressions
      // addCommentReference?.current?.scrollIntoView(true);
      if (addCommentContainerReference?.current) {
        addCommentContainerReference.current.scrollIntoView(true);
      }
    }
  }, [taskDrawerFocusField]);

  return (
    <AddCommentContainer ref={addCommentContainerReference}>
      <UserAvatar user={currentUser} size={34} />
      <AddCommentInputContainer isFocused={isFocused}>
        <TextEditor
          showToolbar
          ref={addCommentReference}
          taskListIdentifier={taskListIdentifier}
          disableMentions={isTemplateTask}
          placeholder="Leave a comment and press enter on your keyboard to save"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            saveComment();
            setIsFocused(false);
          }}
          state={commentState}
          onChange={onCommentChange}
          keyBindingFn={event => {
            if (event.keyCode === 13 && event.shiftKey) {
              return undefined;
            }
            if (event.keyCode === 13) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={command => {
            if (command === 'enter-command') {
              addCommentReference.current.blur();
              return 'handled';
            }

            return 'not-handled';
          }}
        />
      </AddCommentInputContainer>
      {isAddingComment && (
        <AddCommentLoaderContainer>
          <Loader size={LoaderSizes.medium} />
        </AddCommentLoaderContainer>
      )}
    </AddCommentContainer>
  );
};

export default AddComment;
