import React, { useEffect, useRef, useState } from 'react';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Member from 'components/members/Member/Member';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';

import initializeAddCommentHooks from './NewTaskDrawer.AddComment.Hooks';
import {
  AddCommentContainer,
  AddCommentLoaderContainer,
  AddCommentInputContainer,
} from './NewTaskDrawer.AddComment.Styled';
import { FocusDrawerFieldEnum } from './NewTaskDrawer.Utilities';

const AddComment = ({
  addComment,
  parentFormSubmit,
  taskDrawerFocusField,
  taskListIdentifier,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    currentUser,
    commentState,
    onCommentChange,
    saveComment,
    onCommentFocus,
    isAddingComment,
  } = initializeAddCommentHooks({ addComment, parentFormSubmit });

  const addCommentReference = useRef();

  useEffect(() => {
    if (taskDrawerFocusField === FocusDrawerFieldEnum.COMMENT) {
      addCommentReference.current.focus();
      // eslint-disable-next-line no-unused-expressions
      addCommentReference.current?.scrollIntoView(true);
    }
  }, [taskDrawerFocusField]);

  return (
    <AddCommentContainer>
      <Member member={currentUser} size={40} />
      <AddCommentInputContainer isFocused={isFocused}>
        <MentionsEditor
          ref={addCommentReference}
          placeholder="Leave a comment and press enter on your keyboard to save"
          onFocus={() => {
            onCommentFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            saveComment();
            setIsFocused(false);
          }}
          taskListIdentifier={taskListIdentifier}
          state={commentState}
          onChange={onCommentChange}
          keyBindingFn={event => {
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
