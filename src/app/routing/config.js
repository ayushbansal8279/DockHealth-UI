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
import PageNotFound from 'views/PageNotFound';
import PatientDetailsView from 'views/patient-details/PatientDetailsView';
import PeopleView from 'views/people-list/PeopleView';
import PersonDetailsView from 'views/person-details/PersonDetailsView';
import BillingsView from 'views/self-serve/billings/BillingsView';
import DocumentsView from 'views/self-serve/documents/DocumentsView';
import SubscriptionPaymentFinishedView from 'views/self-serve/subscription-payment/SubscriptionPaymentFinishedView';
import SubscriptionPaymentView from 'views/self-serve/subscription-payment/SubscriptionPaymentView';
import SubscriptionsView from 'views/self-serve/subscriptions/SubscriptionsView';
import SupportView from 'views/Support/SupportView';
import TaskListActivityFeedView from 'views/ActivityFeed/TaskListActivityFeedView';
import UserProfileView from 'views/UserProfile/UserProfileView';

import {
  onEnterDashboard,
  onUpdateDashboard,
  onLeaveDashboard,
} from './TemplateCoreSubscriptionPlan/Dashboard';

import {
  onEnterGlobalSearch,
  onLeaveGlobalSearch,
} from './TemplateCoreSubscriptionPlan/GlobalSearch';

import {
  onEnterPatientsView,
  onLeavePatientsView,
} from './TemplateCoreSubscriptionPlan/PatientsView';

import {
  onEnterPatientDetailsView,
  onLeavePatientDetailsView,
} from './TemplateCoreSubscriptionPlan/PatientDetails';

import {
  onEnterPersonDetails,
  onLeavePersonDetails,
} from './TemplateCoreSubscriptionPlan/PersonDetails';

import {
  onEnterListDetailsView,
  onLeaveListDetailsView,
} from './TemplateCoreSubscriptionPlan/ListDetails';
import {
  onEnterTemplatesView,
  onLeaveTemplatesView,
} from './TemplateCoreSubscriptionPlan/TemplatesView';

export const SETTINGS_ROUTES = [
  {
    path: '/userprofile',
    RouteComponent: UserProfileView,
  },
  {
    path: '/support',
    RouteComponent: SupportView,
  },
  {
    path: '/subscriptions',
    RouteComponent: SubscriptionsView,
  },
  {
    path: '/billing',
    RouteComponent: BillingsView,
  },
  {
    path: '/documents',
    RouteComponent: DocumentsView,
  },
  {
    path: '/subscription-payment',
    RouteComponent: SubscriptionPaymentView,
  },
  {
    path: '/subscription-payment-finished',
    RouteComponent: SubscriptionPaymentFinishedView,
  },
];

export const TEMPLATE_CORE_SUBSCRIPTION_PLAN_ROUTES = [
  {
    path: '/home/:tabName',
    RouteComponent: DashboardView,
    onEnter: onEnterDashboard,
    onUpdate: onUpdateDashboard,
    onLeave: onLeaveDashboard,
  },
  {
    path: '/search',
    RouteComponent: GlobalSearchView,
    onEnter: onEnterGlobalSearch,
    onLeave: onLeaveGlobalSearch,
  },
  {
    path: '/patients',
    RouteComponent: PatientsView,
    onEnter: onEnterPatientsView,
    onLeave: onLeavePatientsView,
  },
  {
    path: '/patient/:patientIdentifier/:tabName?',
    RouteComponent: PatientDetailsView,
    onEnter: onEnterPatientDetailsView,
    onLeave: onLeavePatientDetailsView,
  },
  {
    path: '/activityfeed',
    RouteComponent: TaskListActivityFeedView,
  },
  {
    path: '/assignedToPerson/:userIdentifier/:tabName?',
    RouteComponent: PersonDetailsView,
    onEnter: onEnterPersonDetails,
    onLeave: onLeavePersonDetails,
  },
  {
    path: '/people',
    RouteComponent: PeopleView,
  },
  {
    path: '/task-tour/:taskListIdentifier',
    RouteComponent: TaskTourView,
  },
  {
    path: '/tasks/:taskListIdentifier/:tabName?/:taskIdentifier?',
    RouteComponent: ListDetailsView,
    onEnter: onEnterListDetailsView,
    onLeave: onLeaveListDetailsView,
  },
  {
    path: '/templates',
    RouteComponent: React.lazy(() => import('views/templates/TemplatesView')),
    onEnter: onEnterTemplatesView,
    onLeave: onLeaveTemplatesView,
  },

  // <Redirect from="/onboarding/create-account" to="create-account" />
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
];

export const SIMPLE_ROUTES = [
  {
    path: '/selfEnrolledUser',
    RouteComponent: SelfEnrolledUser,
  },
];
