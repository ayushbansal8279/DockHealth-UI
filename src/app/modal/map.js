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
import ListFormModal from './components/ListFormModal/ListFormModal';
import VideoModal from './components/VideoModal/VideoModal';
import LeaveListModal from './components/LeaveListModal/LeaveListModal';
import EditOrganizationModal from './components/EditOrganizationModal/EditOrganizationModal';
import InviteToListModal from './components/InviteToListModal/InviteToListModal';
import ChangePasswordModal from './components/ChangePasswordModal/ChangePasswordModal';
import LeaveOrganizationModal from './components/LeaveOrganizationModal/LeaveOrganizationModal';
import ChangeMobileNumberModal from './components/ChangeMobileNumberModal/ChangeMobileNumberModal';

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
  ListForm: ListFormModal,
  Video: VideoModal,
  LeaveList: LeaveListModal,
  LeaveOrganization: LeaveOrganizationModal,
  EditOrganization: EditOrganizationModal,
  InviteToList: InviteToListModal,
  ChangePassword: ChangePasswordModal,
  ChangeMobileNumber: ChangeMobileNumberModal,
};

export default MODAL_MAP;
