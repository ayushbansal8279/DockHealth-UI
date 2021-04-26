import DeleteGroupModal from './components/DeleteGroupModal/DeleteGroupModal';
import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import DeleteTaskModal from './components/DeleteTaskModal/DeleteTaskModal';
import DeleteSubtaskModal from './components/DeleteSubtaskModal/DeleteSubtaskModal';
import AttachmentsDuplicateModal from './components/AttachmentsDuplicateModal/AttachmentsDuplicateModal';
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
import RightClickTourModal from './components/NewFeaturesModals/RightClickTourModal/RightClickTourModal';
import MultiAssignTourModal from './components/NewFeaturesModals/MultiAssignTourModal/MultiAssignTourModal';
import HomeImprovementsTourModal from './components/NewFeaturesModals/HomeImprovementsTourModal/HomeImprovementsTourModal';
import MultiMentionAssignTourModal from './components/NewFeaturesModals/MultiMentionAssignTourModal/MultiMentionAssignTourModal';
import ReferAColleagueModal from './components/ReferAColleagueModal/ReferAColleagueModal';
import BulkDeleteTasksModal from './components/BulkDeleteTasksModal/BulkDeleteTasksModal';
import BulkCompleteTasksModal from './components/BulkCompleteTasksModal/BulkCompleteTasksModal';
import MoveTasksWithSubtasksModal from './components/MoveTasksWithSubtasksModal/MoveTasksWithSubtasksModal';
import SendingInviteModal from './components/SendingInviteModal/SendingInviteModal';
import CreateTemplateModal from './components/CreateTemplateModal/CreateTemplateModal';
import HomeScreenDragDropModal from './components/HomeScreenDragDropModal/HomeScreenDragDropModal';
import DeleteTemplateModal from './components/DeleteTemplateModal/DeleteTemplateModal';
import SelectTaskDestinationModal from './components/SelectDestinationModal/SelectTaskDestinationModal';
import SelectDestinationModal from './components/SelectDestinationModal/SelectDestinationModal';
import AssignPatientModal from './components/AssignPatientModal/AssignPatientModal';
import UnassignPatientModal from './components/UnassignPatientModal/UnassignPatientModal';

const MODAL_MAP = {
  DeleteGroup: DeleteGroupModal,
  CompleteAllTasks: CompleteAllTasksModal,
  DeleteTask: DeleteTaskModal,
  DeleteSubtask: DeleteSubtaskModal,
  AttachmentsDuplicate: AttachmentsDuplicateModal,
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
  RightClickTour: RightClickTourModal,
  MultiAssignTour: MultiAssignTourModal,
  HomeImprovementsTour: HomeImprovementsTourModal,
  MultiMentionAssignTour: MultiMentionAssignTourModal,
  TrialExpiration: TrialExpirationModal,
  AutoLogout: AutoLogoutModal,
  ReferAColleague: ReferAColleagueModal,
  BulkDeleteTasks: BulkDeleteTasksModal,
  BulkCompleteTasks: BulkCompleteTasksModal,
  MoveTasksWithSubtasks: MoveTasksWithSubtasksModal,
  SendingInvite: SendingInviteModal,
  CreateTemplate: CreateTemplateModal,
  HomeScreenDragDrop: HomeScreenDragDropModal,
  DeleteTemplate: DeleteTemplateModal,
  SelectTaskDestination: SelectTaskDestinationModal,
  SelectDestination: SelectDestinationModal,
  AssignPatient: AssignPatientModal,
  UnassignPatient: UnassignPatientModal,
};

export default MODAL_MAP;
