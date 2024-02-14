import { useSelector, useDispatch } from 'react-redux';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { Task } from '@/app/types/Task';
import { User } from '@/app/types/swagger/models/User';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';
import {
  deleteComment,
  updateComment,
  addComment,
} from '@/app/actions/task-actions';
import { closeModal, openModal } from '@/app/modal/actions';
import CommentIcon from '@/app/img/modals/comment.svg';

export const useCommentsActionHandler = (task: Task) => {
  const currentUser = useSelector(userProfileSelector) as User;
  const taskListIdentifier = task?.taskList?.taskListIdentifier;
  const dispatch = useDispatch();

  const handleRemoveComment = (comment: CommentDto) => {
    deleteComment(
      task,
      comment,
    )(dispatch).then(() => {
      dispatch(closeModal());
    });
  };

  const handleUpdateComment = (comment: CommentDto) => {
    updateComment(task, comment)(dispatch);
  };

  const handleAddComment = (comment: string) => {
    addComment(task, {
      comment,
      creator: currentUser,
    })(dispatch);
  };

  const openDeleteCommentConfirmationModal = (comment: CommentDto) => {
    const modalProps = {
      title: 'Delete comment',
      description:
        'Are you sure you want to delete this comment? This action cannot be undone.',
      icon: CommentIcon,
      confirm: () => handleRemoveComment(comment),
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  };

  return {
    currentUser,
    removeComment: openDeleteCommentConfirmationModal,
    updateComment: handleUpdateComment,
    addComment: handleAddComment,
    taskListIdentifier,
  };
};
