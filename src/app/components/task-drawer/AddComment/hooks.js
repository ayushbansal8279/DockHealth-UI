/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import useBoolean from 'hooks/useBoolean';

const initializeAddCommentHooks = ({ addComment, parentFormSubmit }) => {
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector);

  const [commentState, setCommentState] = useMentionsEditorState();
  const [isAddingComment, setAddingComment, unsetAddingComment] = useBoolean(
    false,
  );

  const onCommentChange = useCallback(
    state => {
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

    addComment(commentTokenizedText)
      .then(() => {
        unsetAddingComment();
        setCommentState();
      })
      .catch(() => {
        unsetAddingComment();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addComment, commentState, setAddingComment, unsetAddingComment]);

  const saveComment = useCallback(() => {
    if (!isAddingComment) {
      onSubmit();
    }
  }, [isAddingComment, onSubmit]);

  const onCommentFocus = useCallback(() => {
    if (!selectedTask || !selectedTask.taskIdentifier) {
      parentFormSubmit();
    }
  }, [selectedTask, parentFormSubmit]);

  return {
    currentUser,
    selectedTask,
    commentState,
    onCommentChange,
    saveComment,
    onCommentFocus,
    isAddingComment,
  };
};

export default initializeAddCommentHooks;
