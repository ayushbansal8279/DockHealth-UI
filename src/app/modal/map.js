import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DuplicateTaskModal from './components/DuplicateTaskModal/DuplicateTaskModal';
import DeleteListModal from './components/DeleteListModal/DeleteListModal';
import DeleteNoteModal from './components/DeleteNoteModal/DeleteNoteModal';
import ListPickerModal from './components/ListPickerModal/ListPickerModal';
import DeleteCommentModal from './components/DeleteCommentModal/DeleteCommentModal';
import ArchivePatientModal from './components/ArchivePatientModal/ArchivePatientModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
  DuplicateTask: DuplicateTaskModal,
  DeleteList: DeleteListModal,
  DeleteNote: DeleteNoteModal,
  ListPicker: ListPickerModal,
  DeleteComment: DeleteCommentModal,
  ArchivePatient: ArchivePatientModal,
};

export default MODAL_MAP;
