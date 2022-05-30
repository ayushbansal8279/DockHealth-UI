import CompleteAllTasksModal from './components/CompleteAllTasksModal/CompleteAllTasksModal';
import AttachmentsDuplicateModal from './components/AttachmentsDuplicateModal/AttachmentsDuplicateModal';
import ListPickerModal from './components/ListPickerModal/ListPickerModal';
import ArchivePatientModal from './components/ArchivePatientModal/ArchivePatientModal';
import RemoveActiveUserModal from './components/RemoveActiveUserModal/RemoveActiveUserModal';
import ArchivePersonModal from './components/ArchivePersonModal/ArchivePersonModal';
import ClearSortFiltersModal from './components/ClearSortFiltersModal/ClearSortFiltersModal';
import ListFormModal from './components/ListFormModal/ListFormModal';
import ListPermissionsModal from './components/ListPermissionsModal/ListPermissionsModal';
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
import NotificationSettingsTourModal from './components/NewFeaturesModals/NotificationSettingsTourModal/NotificationSettingsTourModal';
import AutoLogoutModal from './components/AutoLogoutModal/AutoLogoutModal';
import TaskDensityTourModal from './components/NewFeaturesModals/TaskDensityTourModal/TaskDensityTourModal';
import RightClickTourModal from './components/NewFeaturesModals/RightClickTourModal/RightClickTourModal';
import MultiAssignTourModal from './components/NewFeaturesModals/MultiAssignTourModal/MultiAssignTourModal';
import HomeImprovementsTourModal from './components/NewFeaturesModals/HomeImprovementsTourModal/HomeImprovementsTourModal';
import TaskWorkflowTourModal from './components/NewFeaturesModals/TaskWorkflowTourModal/TaskWorkflowTourModal';
import RecurringTaskTourModal from './components/NewFeaturesModals/RecurringTaskTourModal/RecurringTaskTourModal';
import TaskStatusTourModal from './components/NewFeaturesModals/TaskStatusTourModal/TaskStatusTourModal';
import PatientProfileTourModal from './components/NewFeaturesModals/PatientProfileTourModal/PatientProfileTourModal';
import PatientCustomFieldTourModal from './components/NewFeaturesModals/PatientCustomFieldTourModal/PatientCustomFieldTourModal';
import MultiMentionAssignTourModal from './components/NewFeaturesModals/MultiMentionAssignTourModal/MultiMentionAssignTourModal';
import ReferAColleagueModal from './components/ReferAColleagueModal/ReferAColleagueModal';
import BulkCompleteTasksModal from './components/BulkCompleteTasksModal/BulkCompleteTasksModal';
import MoveTasksWithSubtasksModal from './components/MoveTasksWithSubtasksModal/MoveTasksWithSubtasksModal';
import SendingInviteModal from './components/SendingInviteModal/SendingInviteModal';
import CreateTemplateModal from './components/CreateTemplateModal/CreateTemplateModal';
import CreateSmartFlowModal from './components/CreateSmartFlowModal/CreateSmartFlowModal';
import CreateTemplateFolderModal from './components/CreateTemplateFolderModal/CreateTemplateFolderModal';
import HomeScreenDragDropModal from './components/HomeScreenDragDropModal/HomeScreenDragDropModal';
import SelectTaskDestinationModal from './components/SelectDestinationModal/SelectTaskDestinationModal';
import SelectDestinationModal from './components/SelectDestinationModal/SelectDestinationModal';
import SelectWorkflowDestinationModal from './components/SelectWorkflowDestinationModal/SelectWorkflowDestinationModal';
import AssignPatientModal from './components/AssignPatientModal/AssignPatientModal';
import UnassignPatientModal from './components/UnassignPatientModal/UnassignPatientModal';
import EditPatientListModal from './components/EditPatientListModal/EditPatientListModal';
import AddPatientToListModal from './components/AddPatientToListModal/AddPatientToListModal';
import InterruptEditModal from './components/InterruptEditModal/InterruptEditModal';
import EditCustomFieldModal from './components/EditCustomFieldModal/EditCustomFieldModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import EditUserGroupModal from './components/EditUserGroupModal/EditUserGroupModal';
import AddUserToGroupModal from './components/AddUserToGroupModal/AddUserToGroupModal';
import DeleteTaskConfirmationModal from './components/DeleteTaskConfirmationModal/DeleteTaskConfirmationModal';
import InformationModal from './components/InformationModal/InformationModal';
import UnassignTaskTemplateModal from './components/UnassignTaskTemplateModal/UnassignTaskTemplateModal';
import PatientPickerModal from './components/PatientPickerModal/PatientPickerModal';
import MergePatientsModal from './components/MergePatientsModal/MergePatientsModal';
import SelectDestinationGroupModal from './components/SelectDestinationGroupModal/SelectDestinationGroupModal';
import PatientFolderModal from './components/PatientFolderModal/PatientFolderModal';
import SelectPatientFolderModal from './components/SelectPatientFolderModal/SelectPatientFolderModal';
import SmartFlowListModal from './components/SmartFlowListModal/SmartFlowListModal';
import UnarchivePatientModal from './components/UnarchivePatientModal/UnarchivePatientModal';
import SendEmailFromTaskModal from './components/SendEmailFromTaskModal/SendEmailFromTaskModal';

const MODAL_MAP = {
  CompleteAllTasks: CompleteAllTasksModal,
  AttachmentsDuplicate: AttachmentsDuplicateModal,
  ListPicker: ListPickerModal,
  UnarchivePatient: UnarchivePatientModal,
  ArchivePatient: ArchivePatientModal,
  RemoveActiveUser: RemoveActiveUserModal,
  ArchivePerson: ArchivePersonModal,
  ClearSortFilters: ClearSortFiltersModal,
  ListForm: ListFormModal,
  ListPermissions: ListPermissionsModal,
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
  TaskWorkflowTour: TaskWorkflowTourModal,
  RecurringTaskTour: RecurringTaskTourModal,
  TaskStatusTour: TaskStatusTourModal,
  PatientProfileTour: PatientProfileTourModal,
  PatientCustomFieldTour: PatientCustomFieldTourModal,
  MultiMentionAssignTour: MultiMentionAssignTourModal,
  AutoLogout: AutoLogoutModal,
  ReferAColleague: ReferAColleagueModal,
  BulkCompleteTasks: BulkCompleteTasksModal,
  MoveTasksWithSubtasks: MoveTasksWithSubtasksModal,
  SendingInvite: SendingInviteModal,
  CreateTemplate: CreateTemplateModal,
  CreateSmartFlow: CreateSmartFlowModal,
  CreateTemplateFolder: CreateTemplateFolderModal,
  HomeScreenDragDrop: HomeScreenDragDropModal,
  SelectTaskDestination: SelectTaskDestinationModal,
  SelectDestinationGroup: SelectDestinationGroupModal,
  SelectDestination: SelectDestinationModal,
  SelectWorkflowDestination: SelectWorkflowDestinationModal,
  AssignPatient: AssignPatientModal,
  UnassignPatient: UnassignPatientModal,
  EditPatientList: EditPatientListModal,
  AddPatientToList: AddPatientToListModal,
  InterruptEdit: InterruptEditModal,
  EditCustomField: EditCustomFieldModal,
  DeleteConfirmation: DeleteConfirmationModal,
  DeleteTaskConfirmation: DeleteTaskConfirmationModal,
  EditUserGroup: EditUserGroupModal,
  AddUserToGroup: AddUserToGroupModal,
  Information: InformationModal,
  UnassignTaskTemplate: UnassignTaskTemplateModal,
  PatientPicker: PatientPickerModal,
  MergePatients: MergePatientsModal,
  PatientFolder: PatientFolderModal,
  SelectPatientFolder: SelectPatientFolderModal,
  SmartFlowList: SmartFlowListModal,
  SendEmailFromTask: SendEmailFromTaskModal,
};

export default MODAL_MAP;
