import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DeleteNoteModal from './components/DeleteNoteModal/DeleteNoteModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
  DeleteNote: DeleteNoteModal,
};

export default MODAL_MAP;
