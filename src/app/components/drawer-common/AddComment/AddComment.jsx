import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import {
  AddCommentContainer,
  AvatarWrapper,
  AddCommentLoaderContainer,
  AddCommentInputContainer,
} from './styled';

const AddComment = ({
  autoFocus,
  onAdd,
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const addCommentReference = useRef();
  const addCommentContainerReference = useRef();
  const [isFocused] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const [isAddingComment] = useBoolean(false);

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

  const handleTextEditorChange = (value) => {
    setDescription(value);
  };

  const handleTextEditorFocus = () => {
    onFocus?.();
  };

  const handleTextEditorBlur = (value) => {
    if (value !== '') {
      onAdd(value);
      setDescription('');
    }
    onBlur?.();
  };

  const handleTextEditorKeyEnter = (value) => {
    if (value !== '') {
      onAdd(value);
      setDescription('');
    }
  };

  const selectedTask = useSelector(selectedTaskSelector);

  return (
    <AddCommentContainer ref={addCommentContainerReference}>
      <AvatarWrapper>
        <UserAvatar user={currentUser} size={35} />
      </AvatarWrapper>
      <AddCommentInputContainer isFocused={isFocused}>
        <RichTextEditor
          placeholder="New comment"
          height={120}
          value={description}
          onChange={handleTextEditorChange}
          onBlur={handleTextEditorBlur}
          onFocus={handleTextEditorFocus}
          onKeyEnter={handleTextEditorKeyEnter}
          taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
          mentions={selectedTask?.taskMentions}
          initOnClick
          showCharCount
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
