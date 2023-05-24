import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import {
  AddCommentContainer,
  AddCommentLoaderContainer,
  AddCommentInputContainer,
} from './styled';

const AddComment = ({
  autoFocus,
  // disableMentions,
  onAdd,
  // taskListIdentifier,
}) => {
  const addCommentReference = useRef();
  const addCommentContainerReference = useRef();
  const [isFocused] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const [isAddingComment] =
    useBoolean(false);

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

  const [description, setDescription] = useState(null);

  const handleTextEditorChange = (_, { value }) => {
    setDescription(value);
  };

  const handleTextEditorKeyDown = (_, { value, key, shiftKey }) => {
    if (key === 'Enter' && !shiftKey) {
      onAdd(value);
      setDescription('');
    }
  };

  const selectedTask = useSelector(selectedTaskSelector);

  return (
    <AddCommentContainer ref={addCommentContainerReference}>
      <UserAvatar user={currentUser} size={34} />
      <AddCommentInputContainer isFocused={isFocused}>
        <TextEditor
          type="textarea"
          value={description}
          onChange={handleTextEditorChange}
          onKeyDown={handleTextEditorKeyDown}
          mentions={selectedTask?.taskMentions}
          enabled={{
            mentions: true,
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
