import React from 'react';
import PatientsView from 'components/patients/PatientsView';
import TaskTourView from 'views/TaskTour/TaskTourView';
import GlobalSearchView from 'views/global-search/GlobalSearchView';
import ChangePhoneNumber from 'views/auth/ChangePhoneNumber';
import ConfirmMFACode from 'views/auth/ConfirmMfaCode';
import ConfirmRegistration from 'views/auth/ConfirmRegistration';
import ConfirmRegistrationSuccess from 'views/auth/ConfirmRegistrationSuccess';
import CreateAccount from 'views/auth/CreateAccount';
import DashboardView from 'views/dashboard/DashboardView';
import EmailSent from 'views/auth/EmailSent';
import ForgotPassword from 'views/auth/ForgotPassword';
import LoginPassword from 'views/auth/LoginPassword';
import LoginUser from 'views/auth/LoginUser';
import LoginWelcome from 'views/auth/LoginWelcome';
import Logout from 'views/auth/Logout';
import ResendCode from 'views/auth/ResendCode';
import ResetPassword from 'views/auth/ResetPassword';
import ResetPasswordSuccess from 'views/auth/ResetPasswordSuccess';
import SelfEnrolledUser from 'views/auth/SelfEnrolledUser';
import UnEnrolledUser from 'views/auth/UnEnrolledUser';
import ApproveDisapproveUser from 'views/auth/ApproveDisapproveUser';
import EmbeddedSSO from 'views/auth/EmbeddedSso';
import ErrorPage from 'views/ErrorPage';
import ListDetailsView from 'views/list-details/ListDetailsView';
import OnboardingBaaCheckView from 'views/onboarding/OnboardingBaaCheckView/OnboardingBaaCheckView';
import OnboardingBaaInvitationSentView from 'views/onboarding/OnboardingBaaInvitationSentView/OnboardingBaaInvitationSentView';
import OnboardingBaaOverviewView from 'views/onboarding/OnboardingBaaOverviewView/OnboardingBaaOverviewView';
import OnboardingEulaView from 'views/onboarding/OnboardingEulaView/OnboardingEulaView';
import OnboardingTrialCheckView from 'views/onboarding/OnboardingTrialCheckView/OnboardingTrialCheckView';
import OnboardingNewOrganizationInfoView from 'views/onboarding/OnboardingNewOrganizationInfoView/OnboardingNewOrganizationInfoView';
import OnboardingCreateOrganizationView from 'views/onboarding/OnboardingCreateOrganizationView/OnboardingCreateOrganizationView';
import OnboardingOrgSetupView from 'views/onboarding/OnboardingOrgSetupView/OnboardingOrgSetupView';
import OnboardingTeamSetupView from 'views/onboarding/OnboardingTeamSetupView/OnboardingTeamSetupView';
import OnboardingSelectCustomerTypeView from 'views/onboarding/OnboardingSelectCustomerTypeView/OnboardingSelectCustomerTypeView';
import OnboardingQuestions from 'views/onboarding/OnboardingQuestions/OnboardingQuestions';
import PageNotFound from 'views/PageNotFound';
import PatientDetailsView from 'views/patient-details/PatientDetailsView';
import UserGroupView from 'views/user-group/UserGroupView';
import PersonDetailsView from 'views/person-details/PersonDetailsView';
import BillingsView from 'views/self-serve/billings/BillingsView';
import DocumentsView from 'views/self-serve/documents/DocumentsView';
import SubscriptionPaymentFinishedView from 'views/self-serve/subscription-payment/SubscriptionPaymentFinishedView';
import SubscriptionPaymentView from 'views/self-serve/subscription-payment/SubscriptionPaymentView';
import SubscriptionsView from 'views/self-serve/subscriptions/SubscriptionsView';
import SubscriptionExpiredView from 'views/self-serve/subscriptions/SubscriptionExpiredView';
import UsersView from 'views/self-serve/users/UsersView';
import SupportView from 'views/Support/SupportView';
import TaskListActivityFeedView from 'views/ActivityFeed/TaskListActivityFeedView';
import UserProfileView from 'views/UserProfile/UserProfileView';
import CustomFieldsView from 'views/custom-fields/CustomFieldsView';
import AnalyticsView from 'views/analytics/AnalyticsView';
import ChatView from 'views/chat/ChatView';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import SingleTaskView from 'views/single-task/SingleTaskView';
import Templates from 'views/Templates/Templates';
import Contacts from 'views/Contacts/Contacts';
import { PERMISSIONS } from 'helpers/permission-mapper';
import { onLeaveGlobalSearch } from './TemplateCoreSubscriptionPlan/GlobalSearch';
import {
  onEnterListDetailsView,
  onLeaveListDetailsView,
} from './TemplateCoreSubscriptionPlan/ListDetails';

const {
  CAN_ACCESS_HOME_PAGE,
  CAN_ACCESS_SEARCH_PAGE,
  CAN_ACCESS_TASK_LIST_PAGE,
  CAN_ACCESS_PEOPLE_LIST_PAGE,
  CAN_ACCESS_MEMBER_LIST_PAGE,
  CAN_ACCESS_WORKFLOW_LIST_PAGE,
  CAN_ACCESS_ANALYTICS_PAGE,
  CAN_ACCESS_CHAT_PAGE,
  CAN_ACCESS_SETTINGS_PAGE,
} = PERMISSIONS;

export const SETTINGS_ROUTES = [
  {
    path: '/userprofile',
    RouteComponent: UserProfileView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/support',
    RouteComponent: SupportView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/subscriptions',
    RouteComponent: SubscriptionsView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/users',
    RouteComponent: UsersView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/billing',
    RouteComponent: BillingsView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/documents',
    RouteComponent: DocumentsView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/subscription-payment',
    RouteComponent: SubscriptionPaymentView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/subscription-payment-finished',
    RouteComponent: SubscriptionPaymentFinishedView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/subscription-expired',
    RouteComponent: SubscriptionExpiredView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/custom-fields/:tabName?',
    RouteComponent: CustomFieldsView,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/templates',
    RouteComponent: Templates,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
  {
    path: '/contacts',
    RouteComponent: Contacts,
    permissions: [CAN_ACCESS_SETTINGS_PAGE],
  },
];

export const TEMPLATE_CORE_SUBSCRIPTION_PLAN_ROUTES = [
  {
    path: '/home/my-tasks',
    RouteComponent: props => (
      <DashboardView tabName={DashboardTasksTab.MY_TASKS} {...props} />
    ),
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
  {
    path: '/home/shared-with-me-tasks',
    RouteComponent: props => (
      <DashboardView tabName={DashboardTasksTab.SHARED_TASKS} {...props} />
    ),
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
  {
    path: '/home/all-tasks',
    RouteComponent: props => (
      <DashboardView tabName={DashboardTasksTab.ALL_TASKS} {...props} />
    ),
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
  {
    path: '/search',
    RouteComponent: GlobalSearchView,
    onLeave: onLeaveGlobalSearch,
    permissions: [CAN_ACCESS_SEARCH_PAGE],
  },
  {
    path: '/patients/list/:listIdentifier?',
    RouteComponent: PatientsView,
    permissions: [CAN_ACCESS_MEMBER_LIST_PAGE],
  },
  {
    path: '/patient/:patientIdentifier',
    RouteComponent: PatientDetailsView,
    permissions: [CAN_ACCESS_MEMBER_LIST_PAGE],
  },
  {
    path: '/activityfeed',
    RouteComponent: TaskListActivityFeedView,
    permissions: [CAN_ACCESS_TASK_LIST_PAGE],
  },
  {
    path: '/assignedToPerson/:userIdentifier/:tabName?',
    RouteComponent: PersonDetailsView,
    permissions: [CAN_ACCESS_TASK_LIST_PAGE],
  },
  {
    path: '/people/:groupIdentifier?',
    RouteComponent: UserGroupView,
    permissions: [CAN_ACCESS_PEOPLE_LIST_PAGE],
  },
  {
    path: '/task/:identifier',
    RouteComponent: SingleTaskView,
    permissions: [CAN_ACCESS_TASK_LIST_PAGE],
  },
  {
    path: '/task-tour/:taskListIdentifier',
    RouteComponent: TaskTourView,
    permissions: [CAN_ACCESS_TASK_LIST_PAGE],
  },
  {
    path: '/tasks/:taskListIdentifier/:tabName?/:taskIdentifier?',
    RouteComponent: ListDetailsView,
    onEnter: onEnterListDetailsView,
    onLeave: onLeaveListDetailsView,
    permissions: [CAN_ACCESS_TASK_LIST_PAGE],
  },
  {
    path: '/workflows/library/:identifier?',
    RouteComponent: React.lazy(() =>
      import('views/task-template/TaskTemplateView'),
    ),
    permissions: [CAN_ACCESS_WORKFLOW_LIST_PAGE],
  },
  {
    path: '/workflows/builder/:identifier',
    RouteComponent: React.lazy(() =>
      import('views/smart-flow-builder/SmartFlowBuilderView'),
    ),
    permissions: [CAN_ACCESS_WORKFLOW_LIST_PAGE],
  },
  {
    path: '/analytics',
    RouteComponent: AnalyticsView,
    permissions: [CAN_ACCESS_ANALYTICS_PAGE],
  },
  {
    path: '/chat',
    RouteComponent: ChatView,
    permissions: [CAN_ACCESS_CHAT_PAGE],
  },
];

export const ONBOARDING_ROUTES = [
  {
    path: '/eula',
    RouteComponent: OnboardingEulaView,
  },
  {
    path: '/baa-overview',
    RouteComponent: OnboardingBaaOverviewView,
  },
  {
    path: '/baa-check',
    RouteComponent: OnboardingBaaCheckView,
  },
  {
    path: '/trial-check',
    RouteComponent: OnboardingTrialCheckView,
  },
  {
    path: '/baa-invitation-sent',
    RouteComponent: OnboardingBaaInvitationSentView,
  },
  {
    path: '/new-organization',
    RouteComponent: OnboardingNewOrganizationInfoView,
  },
  {
    path: '/create-organization',
    RouteComponent: OnboardingCreateOrganizationView,
  },
  {
    path: '/organization-setup',
    RouteComponent: OnboardingOrgSetupView,
  },
  {
    path: '/team-setup',
    RouteComponent: OnboardingTeamSetupView,
  },
  {
    path: '/questions',
    RouteComponent: OnboardingQuestions,
  },
  {
    path: '/customer-preference',
    RouteComponent: OnboardingSelectCustomerTypeView,
  },
];

export const AUTH_ROUTES = [
  {
    path: '/confirmRegistration',
    RouteComponent: ConfirmRegistration,
  },
  {
    path: '/confirmRegistrationSuccess',
    RouteComponent: ConfirmRegistrationSuccess,
  },
  {
    path: '/create-account',
    RouteComponent: CreateAccount,
  },
  {
    path: '/login',
    RouteComponent: LoginUser,
    onEnter: () => {
      sessionStorage.removeItem('currentOrganizationIdentifier');
    },
  },
  {
    path: '/loginUser',
    RouteComponent: LoginPassword,
  },
  {
    path: '/welcome',
    RouteComponent: LoginWelcome,
  },
  {
    path: '/logout',
    RouteComponent: Logout,
  },
  {
    path: '/resendCode',
    RouteComponent: ResendCode,
  },
  {
    path: '/forgotPassword',
    RouteComponent: ForgotPassword,
  },
  {
    path: '/resetPassword',
    RouteComponent: ResetPassword,
  },
  {
    path: '/changePhoneNumber',
    RouteComponent: ChangePhoneNumber,
  },
  {
    path: '/confirmMFACode',
    RouteComponent: ConfirmMFACode,
  },
  {
    path: '/pagenotfound',
    RouteComponent: PageNotFound,
  },
  {
    path: '/errorPage',
    RouteComponent: ErrorPage,
  },
  {
    path: '/unEnrolledUser',
    RouteComponent: UnEnrolledUser,
  },
  {
    path: '/resetPasswordEmailSent',
    RouteComponent: EmailSent,
  },
  {
    path: '/resetPasswordSuccess',
    RouteComponent: ResetPasswordSuccess,
  },
  {
    path: '/inviteRequest/:requestIdentifier/:decisionType/:userIdentifier',
    RouteComponent: ApproveDisapproveUser,
  },
  {
    path: '/embedded',
    RouteComponent: EmbeddedSSO,
    onEnter: () => {
      sessionStorage.removeItem('currentOrganizationIdentifier');
    },
  },
];

export const SIMPLE_ROUTES = [
  {
    path: '/selfEnrolledUser',
    RouteComponent: SelfEnrolledUser,
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
];
