import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DuplicateTaskModal from './components/DuplicateTaskModal/DuplicateTaskModal';
import DeleteListModal from './components/DeleteListModal/DeleteListModal';
import DeleteNoteModal from './components/DeleteNoteModal/DeleteNoteModal';
import ListPickerModal from './components/ListPickerModal/ListPickerModal';
import DeleteCommentModal from './components/DeleteCommentModal/DeleteCommentModal';
import ArchivePatientModal from './components/ArchivePatientModal/ArchivePatientModal';
import RemoveActiveUserModal from './components/RemoveActiveUserModal/RemoveActiveUserModal';
import ArchivePersonModal from './components/ArchivePersonModal/ArchivePersonModal';
import ClearSortFiltersModal from './components/ClearSortFiltersModal/ClearSortFiltersModal';
import CreateListModal from './components/CreateListModal/CreateListModal';
import VideoModal from './components/VideoModal/VideoModal';
import LeaveListModal from './components/LeaveListModal/LeaveListModal';

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
  RemoveActiveUser: RemoveActiveUserModal,
  ArchivePerson: ArchivePersonModal,
  ClearSortFilters: ClearSortFiltersModal,
  CreateList: CreateListModal,
  Video: VideoModal,
  LeaveList: LeaveListModal,
};

export default MODAL_MAP;
