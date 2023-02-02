import React, { lazy } from 'react';
import ErrorPage from 'views/ErrorPage';
import PageNotFound from 'views/PageNotFound';
import ChatView from 'views/chat/ChatView';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { PERMISSIONS } from 'helpers/permission-mapper';
import { onLeaveGlobalSearch } from './TemplateCoreSubscriptionPlan/GlobalSearch';
import {
  onEnterListDetailsView,
  onLeaveListDetailsView,
} from './TemplateCoreSubscriptionPlan/ListDetails';

const UsersView = lazy(() => import('views/self-serve/users/UsersView'));
const Contacts = lazy(() => import('views/Contacts/Contacts'));
const Templates = lazy(() => import('views/Templates/Templates'));
const SingleTaskView = lazy(() => import('views/single-task/SingleTaskView'));
const AnalyticsView = lazy(() => import('views/analytics/AnalyticsView'));
const CustomFieldsView = lazy(() =>
  import('views/custom-fields/CustomFieldsView'),
);
const UserProfileView = lazy(() => import('views/UserProfile/UserProfileView'));
const TaskListActivityFeedView = lazy(() =>
  import('views/ActivityFeed/TaskListActivityFeedView'),
);
const SupportView = lazy(() => import('views/Support/SupportView'));
const SubscriptionExpiredView = lazy(() =>
  import('views/self-serve/subscriptions/SubscriptionExpiredView'),
);
const SubscriptionsView = lazy(() =>
  import('views/self-serve/subscriptions/SubscriptionsView'),
);
const SubscriptionPaymentView = lazy(() =>
  import('views/self-serve/subscription-payment/SubscriptionPaymentView'),
);
const SubscriptionPaymentFinishedView = lazy(() =>
  import(
    'views/self-serve/subscription-payment/SubscriptionPaymentFinishedView'
  ),
);
const DocumentsView = lazy(() =>
  import('views/self-serve/documents/DocumentsView'),
);
const BillingsView = lazy(() =>
  import('views/self-serve/billings/BillingsView'),
);
const PersonDetailsView = lazy(() =>
  import('views/person-details/PersonDetailsView'),
);
const UserGroupView = lazy(() => import('views/user-group/UserGroupView'));
const PatientDetailsView = lazy(() =>
  import('views/patient-details/PatientDetailsView'),
);
const OnboardingQuestions = lazy(() =>
  import('views/onboarding/OnboardingQuestions/OnboardingQuestions'),
);
const OnboardingSelectCustomerTypeView = lazy(() =>
  import(
    'views/onboarding/OnboardingSelectCustomerTypeView/OnboardingSelectCustomerTypeView'
  ),
);
const OnboardingTeamSetupView = lazy(() =>
  import('views/onboarding/OnboardingTeamSetupView/OnboardingTeamSetupView'),
);
const OnboardingOrgSetupView = lazy(() =>
  import('views/onboarding/OnboardingOrgSetupView/OnboardingOrgSetupView'),
);
const OnboardingCreateOrganizationView = lazy(() =>
  import(
    'views/onboarding/OnboardingCreateOrganizationView/OnboardingCreateOrganizationView'
  ),
);
const OnboardingNewOrganizationInfoView = lazy(() =>
  import(
    'views/onboarding/OnboardingNewOrganizationInfoView/OnboardingNewOrganizationInfoView'
  ),
);
const OnboardingTrialCheckView = lazy(() =>
  import('views/onboarding/OnboardingTrialCheckView/OnboardingTrialCheckView'),
);
const OnboardingEulaView = lazy(() =>
  import('views/onboarding/OnboardingEulaView/OnboardingEulaView'),
);
const OnboardingBaaOverviewView = lazy(() =>
  import(
    'views/onboarding/OnboardingBaaOverviewView/OnboardingBaaOverviewView'
  ),
);
const OnboardingBaaInvitationSentView = lazy(() =>
  import(
    'views/onboarding/OnboardingBaaInvitationSentView/OnboardingBaaInvitationSentView'
  ),
);
const OnboardingBaaCheckView = lazy(() =>
  import('views/onboarding/OnboardingBaaCheckView/OnboardingBaaCheckView'),
);
const ListDetailsView = lazy(() =>
  import('views/list-details/ListDetailsView'),
);
const ApproveDisapproveUser = lazy(() =>
  import('views/auth/ApproveDisapproveUser'),
);
const UnEnrolledUser = lazy(() => import('views/auth/UnEnrolledUser'));
const SelfEnrolledUser = lazy(() => import('views/auth/SelfEnrolledUser'));
const ResetPasswordSuccess = lazy(() =>
  import('views/auth/ResetPasswordSuccess'),
);
const ResetPassword = lazy(() => import('views/auth/ResetPassword'));
const ResendCode = lazy(() => import('views/auth/ResendCode'));
const Logout = lazy(() => import('views/auth/Logout'));
const LoginWelcome = lazy(() => import('views/auth/LoginWelcome'));
const LoginUser = lazy(() => import('views/auth/LoginUser'));
const LoginPassword = lazy(() => import('views/auth/LoginPassword'));
const ForgotPassword = lazy(() => import('views/auth/ForgotPassword'));
const EmailSent = lazy(() => import('views/auth/EmailSent'));
const DashboardView = lazy(() => import('views/dashboard/DashboardView'));
const CreateAccount = lazy(() => import('views/auth/CreateAccount'));
const ConfirmRegistrationSuccess = lazy(() =>
  import('views/auth/ConfirmRegistrationSuccess'),
);
const ConfirmRegistration = lazy(() =>
  import('views/auth/ConfirmRegistration'),
);
const ConfirmMFACode = lazy(() => import('views/auth/ConfirmMfaCode'));
const ChangePhoneNumber = lazy(() => import('views/auth/ChangePhoneNumber'));
const GlobalSearchView = lazy(() =>
  import('views/global-search/GlobalSearchView'),
);
const TaskTourView = lazy(() => import('views/TaskTour/TaskTourView'));
const PatientsView = lazy(() => import('components/patients/PatientsView'));

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
  CAN_ACCESS_PROFILE_PAGE,
} = PERMISSIONS;

export const SETTINGS_ROUTES = [
  {
    path: '/userprofile',
    RouteComponent: UserProfileView,
    permissions: [CAN_ACCESS_PROFILE_PAGE],
  },
  {
    path: '/support',
    RouteComponent: SupportView,
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
    permissions: [CAN_ACCESS_PROFILE_PAGE],
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
    RouteComponent: (props) => (
      <DashboardView tabName={DashboardTasksTab.MY_TASKS} {...props} />
    ),
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
  {
    path: '/home/shared-with-me-tasks',
    RouteComponent: (props) => (
      <DashboardView tabName={DashboardTasksTab.SHARED_TASKS} {...props} />
    ),
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
  {
    path: '/home/all-tasks',
    RouteComponent: (props) => (
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
  // {
  //   path: '/embedded',
  //   RouteComponent: EmbeddedSSO,
  //   onEnter: () => {
  //     sessionStorage.removeItem('currentOrganizationIdentifier');
  //   },
  // },
];

export const SIMPLE_ROUTES = [
  {
    path: '/selfEnrolledUser',
    RouteComponent: SelfEnrolledUser,
    permissions: [CAN_ACCESS_HOME_PAGE],
  },
];
