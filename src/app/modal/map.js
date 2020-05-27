import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
};

export default MODAL_MAP;
