import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DuplicateTaskModal from './components/DuplicateTaskModal/DuplicateTaskModal';
import DeleteListModal from './components/DeleteListModal/DeleteListModal';
import DeleteNoteModal from './components/DeleteNoteModal/DeleteNoteModal';
import DeleteCommentModal from './components/DeleteCommentModal/DeleteCommentModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
  DuplicateTask: DuplicateTaskModal,
  DeleteList: DeleteListModal,
  DeleteNote: DeleteNoteModal,
  DeleteComment: DeleteCommentModal,
};

export default MODAL_MAP;
