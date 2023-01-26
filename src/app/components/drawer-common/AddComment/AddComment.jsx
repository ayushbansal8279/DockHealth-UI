import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import TextEditor from 'components/common/TextEditor/TextEditor';
import {
  AddCommentContainer,
  AddCommentLoaderContainer,
  AddCommentInputContainer,
} from './styled';

const AddComment = ({
  autoFocus,
  disableMentions,
  onAdd,
  taskListIdentifier,
}) => {
  const addCommentReference = useRef();
  const addCommentContainerReference = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const [commentState, setCommentState] = useMentionsEditorState();
  const [isAddingComment, setAddingComment, unsetAddingComment] =
    useBoolean(false);

  const onCommentChange = useCallback(
    (state) => {
      if (!isAddingComment) {
        setCommentState(state);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAddingComment],
  );

  const onSubmit = useCallback(() => {
    setAddingComment();

    const newComment = convertFromEditorStateToOutput(commentState, true);
    const commentTokenizedText = newComment.tokenizedText;

    if (commentTokenizedText !== undefined && commentTokenizedText === '') {
      unsetAddingComment();
      return;
    }

    onAdd(commentTokenizedText);
    setTimeout(() => {
      unsetAddingComment();
      setCommentState();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAdd, commentState, setAddingComment, unsetAddingComment]);

  const saveComment = useCallback(() => {
    if (!isAddingComment) {
      onSubmit();
    }
  }, [isAddingComment, onSubmit]);

  useEffect(() => {
    if (autoFocus && addCommentReference?.current) {
      if (addCommentReference.current?.editor?.focus) {
        setTimeout(() => addCommentReference.current.editor.focus(), 0);
      }
      // eslint-disable-next-line no-unused-expressions
      if (addCommentContainerReference?.current) {
        setTimeout(
          () => addCommentContainerReference.current.scrollIntoView(true),
          0,
        );
      }
    }
  }, [autoFocus]);

  return (
    <AddCommentContainer ref={addCommentContainerReference}>
      <UserAvatar user={currentUser} size={34} />
      <AddCommentInputContainer isFocused={isFocused}>
        <TextEditor
          showToolbar
          ref={addCommentReference}
          taskListIdentifier={taskListIdentifier}
          disableMentions={disableMentions}
          placeholder="Leave a comment and press enter on your keyboard to save"
          fullHeight
          getFocusFromParent={isFocused}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            saveComment();
            setIsFocused(false);
          }}
          state={commentState}
          onChange={onCommentChange}
          keyBindingFn={(event) => {
            if (event.keyCode === 13 && event.shiftKey) {
              return undefined;
            }
            if (event.keyCode === 13) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={(command) => {
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
