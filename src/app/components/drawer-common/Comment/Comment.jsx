import React, { useRef, useEffect, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useBoolean } from 'hooks/useBoolean';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { getCommentIdToScroll } from 'helpers/scroll-helper';
import {
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  CommentMemberContainer,
  CommentActionsSection,
} from './styled';
import { getCommentDetails } from './helpers';
import CommentTextReadOnly from './CommentTextReadOnly';

const Comment = ({
  comment,
  onDelete,
  onUpdate,
  currentUser,
  selectedTask,
}) => {
  const { creator, commentIdentifier, commentMentions, tokenizedComment } =
    comment;

  // menu variables ----------------------
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // <null | HTMLElement>
  const menuOpen = Boolean(menuAnchorEl);

  const commentEditorReference = useRef();
  const [isEdited, setIsEdited] = useState(false);
  const [isValueReset, setValueReset] = useState(false);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);

  useEffect(() => {
    if (isEdited) {
      commentEditorReference?.current?.focus();
    }
  }, [isEdited, commentEditorReference]);

  const isCommentAuthor =
    currentUser?.userIdentifier === creator.userIdentifier;

  const commentDetails = getCommentDetails(comment);

  const [currentValue, setCurrentValue] = useState(tokenizedComment);

  const handleTextEditorChange = (value) => {
    setValueReset(false);
    setCurrentValue(value);
  };

  const handleSave = (value) => {
    if (value !== '') {
      onUpdate({
        commentIdentifier,
        comment: value,
      });
      setCurrentValue(value);
    }
    handleCancel();
    unsetFocused();
  };

  const handleCancel = () => {
    setIsEdited(false);
    setValueReset(true);
  };

  // #region menu methods-------------------------

  const handleOpenMenu = (
    event /* : React.MouseEvent<HTMLButtonElement> */,
  ) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEdited(true);
    setValueReset(false);
    setFocused();
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    onDelete(comment);
    handleCloseMenu();
  };

  // #endregion menu methods-------------------------

  const renderMenu = (
    <>
      <IconButton
        onClick={handleOpenMenu}
        aria-controls={menuOpen ? 'comment-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <CommentWrapper id={getCommentIdToScroll(comment.commentIdentifier)}>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={35} />
      </CommentMemberContainer>
      <CommentContainer isEditing={isEdited}>
        <CommentContent>
          <CommentText>
            {isEdited ? (
              <RichTextEditor
                height={60}
                readonly={!isEdited}
                showToolbar={isEdited}
                focus={isFocused}
                value={currentValue}
                reset={isValueReset}
                onChange={handleTextEditorChange}
                onBlur={handleSave}
                onKeyEnter={handleSave}
                onKeyEscape={handleCancel}
                initOnClick
                showCharCount
                taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
                mentions={commentMentions}
              />
            ) : (
              <CommentTextReadOnly comment={comment} />
            )}
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
        <CommentActionsSection>
          {!isEdited && isCommentAuthor && renderMenu}
        </CommentActionsSection>
      </CommentContainer>
    </CommentWrapper>
  );
};

export default Comment;
