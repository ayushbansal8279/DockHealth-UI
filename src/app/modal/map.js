import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DeleteSubtaskModal from './components/DeleteSubtaskModal/DeleteSubtaskModal';
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
import ConfirmationModal from './components/ConfirmationModal/ConfirmationModal';
import OnboardingInviteConfirmationModal from './components/OnboardingInviteConfirmationModal/OnboardingInviteConfirmationModal';
import ArchiveUserModal from './components/ArchiveUserModal/ArchiveUserModal';
import SelectOwnerModal from './components/SelectOwnerModal/SelectOwnerModal';
import MentionsTourModal from './components/NewFeaturesModals/MentionsTourModal/MentionsTourModal';
import TrialExpirationModal from './components/TrialExpirationModal/TrialExpirationModal';
import NotificationSettingsTourModal from './components/NewFeaturesModals/NotificationSettingsTourModal/NotificationSettingsTourModal';
import AutoLogoutModal from './components/AutoLogoutModal/AutoLogoutModal';
import TaskDensityTourModal from './components/NewFeaturesModals/TaskDensityTourModal/TaskDensityTourModal';
import SelectTaskDestinationModal from './components/SelectTaskDestinationModal/SelectTaskDestinationModal';
import ReferAColleagueModal from './components/ReferAColleagueModal/ReferAColleagueModal';
import BulkDeleteTasksModal from './components/BulkDeleteTasksModal/BulkDeleteTasksModal';
import BulkCompleteTasksModal from './components/BulkCompleteTasksModal/BulkCompleteTasksModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
  DeleteSubtask: DeleteSubtaskModal,
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
  Confirmation: ConfirmationModal,
  OnboardingInviteConfirmation: OnboardingInviteConfirmationModal,
  ArchiveUser: ArchiveUserModal,
  SelectOwner: SelectOwnerModal,
  MentionsTour: MentionsTourModal,
  NotificationSettingsTour: NotificationSettingsTourModal,
  TaskDensityTour: TaskDensityTourModal,
  TrialExpiration: TrialExpirationModal,
  AutoLogout: AutoLogoutModal,
  SelectTaskDestination: SelectTaskDestinationModal,
  ReferAColleague: ReferAColleagueModal,
  BulkDeleteTasks: BulkDeleteTasksModal,
  BulkCompleteTasks: BulkCompleteTasksModal,
};

export default MODAL_MAP;
