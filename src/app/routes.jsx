import { parse } from 'query-string';
import { equals, pick } from 'ramda';
import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import {
  hashHistory,
  IndexRoute,
  Redirect,
  Route,
  Router,
  IndexRedirect,
} from 'react-router';
import { useEffectOnce } from 'react-use';
import PatientDetailsView from 'views/Patient/PatientDetailsView';
import PatientTasksListView from 'views/Patient/PatientTasksListView';
import GlobalSearchView from 'views/GlobalSearch/GlobalSearchView';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import GenericHeader from 'components/common/GenericHeader';
import { setHeader } from 'actions/header-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import * as PatientTasksActions from 'actions/patient-tasks-actions';
import * as GlobalSearchActions from 'actions/global-search-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { onEnterTasksGroupsList } from 'sagas/tasks-groups-list-saga';
import { getPatient } from 'sagas/patient-saga';
import {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  fetchPatientFilters,
  initalizeSavedFilters,
} from 'sagas/patient-tasks-saga';
import { initializeDashboardView } from 'sagas/dashboard-saga';
import DashboardView from 'views/Dashboard/DashboardView';

import {
  getMembersByTaskListId,
  getTaskListForUser,
} from 'actions/tasklist-actions';
import { findPendingTaskListsForUser } from 'actions/invitation-actions';
import {
  getFiltersForMegaFilter,
  getFiltersForPeopleListMegaFilter,
  clearFiltersForMegaFilter,
} from 'actions/mega-filter-actions';
import sendEvent from 'api/usage-api';
import PatientsView from 'components/patients/PatientsView';
import handleFeatureToggle from 'helpers/handle-feature-toggle';
import TaskTourView from 'views/TaskTour/TaskTourView';
import App from 'views/App';
import ChangePhoneNumber from './views/auth/ChangePhoneNumber';
import ConfirmMFACode from './views/auth/ConfirmMfaCode';
import ConfirmRegistration from './views/auth/ConfirmRegistration';
import ConfirmRegistrationSuccess from './views/auth/ConfirmRegistrationSuccess';
import CreateAccount from './views/auth/CreateAccount';
import EmailSent from './views/auth/EmailSent';
import ForgotPassword from './views/auth/ForgotPassword';
import LoginPassword from './views/auth/LoginPassword';
import LoginUser from './views/auth/LoginUser';
import LoginWelcome from './views/auth/LoginWelcome';
import Logout from './views/auth/Logout';
import ResendCode from './views/auth/ResendCode';
import ResetPassword from './views/auth/ResetPassword';
import ResetPasswordSuccess from './views/auth/ResetPasswordSuccess';
import SelfEnrolledUser from './views/auth/SelfEnrolledUser';
import UnEnrolledUser from './views/auth/UnEnrolledUser';
import ErrorPage from './views/ErrorPage';
// import Inbox from './views/Inbox';
import ListDetailsView from './views/ListDetails/ListDetailsView';
import OnboardingCreateOrganizationView from './views/onboarding/OnboardingCreateOrganizationView/OnboardingCreateOrganizationView';
import OnboardingBaaCheckView from './views/onboarding/OnboardingBaaCheckView/OnboardingBaaCheckView';
import OnboardingBaaInvitationSentView from './views/onboarding/OnboardingBaaInvitationSentView/OnboardingBaaInvitationSentView';
import OnboardingBaaOverviewView from './views/onboarding/OnboardingBaaOverviewView/OnboardingBaaOverviewView';
import OnboardingEulaView from './views/onboarding/OnboardingEulaView/OnboardingEulaView';
import OnboardingOrgSetupView from './views/onboarding/OnboardingOrgSetupView/OnboardingOrgSetupView';
import OnboardingTeamSetupView from './views/onboarding/OnboardingTeamSetupView/OnboardingTeamSetupView';
import OnboardingTrialCheckView from './views/onboarding/OnboardingTrialCheckView/OnboardingTrialCheckView';
import OnboardingTemplate from './views/onboarding/OnboardingTemplate';
import PageNotFound from './views/PageNotFound';
import PatientEditView from './views/PatientEditView';
import PeopleView from './views/People/PeopleView';
import PersonDetailsView from './views/PersonDetails/PersonDetailsView';
import BillingsView from './views/self-serve/billings/BillingsView';
import DocumentsView from './views/self-serve/documents/DocumentsView';
import SubscriptionPaymentFinishedView from './views/self-serve/subscription-payment/SubscriptionPaymentFinishedView';
import SubscriptionPaymentView from './views/self-serve/subscription-payment/SubscriptionPaymentView';
import SubscriptionsView from './views/self-serve/subscriptions/SubscriptionsView';
import SupportView from './views/Support/SupportView';
import TaskListActivityFeedView from './views/TaskList/TaskListActivityFeedView';
import TaskListView from './views/TaskList/TaskListView';
import TemplateAuth from './views/TemplateAuth';
import TemplateAuthBase from './views/TemplateAuthBase/TemplateAuthBase';
import TemplateCore from './views/TemplateCore/TemplateCore';
import TemplateCoreSubscriptionPlan from './views/TemplateCore/TemplateCoreSubscriptionPlan';
import UserProfileView from './views/UserProfile/UserProfileView';
import { checkUserAuthentication } from './views/TemplateCore/TemplateCore.Utilities';
import { setLocationAndParameters } from './location/actions';
import {
  initializeHiddenNavbarTemplate,
  removeHiddenNavbarTemplate,
} from './sagas/template-saga';

const transformPathname = pathname =>
  decodeURIComponent(pathname).replace(/^\/+/, '/');

const withFeatureToggle = store => ({ location }) => {
  const user = store.getState().userState?.userProfile;

  if (user?.userIdentifier) {
    handleFeatureToggle({ location, user });
  }
};

const sendPageviewEvent = ({ pathname }) => {
  const searchParameters = parse(hashHistory.getCurrentLocation()?.search);

  const mappedSearchParameters = Object.entries(
    searchParameters,
  ).map(([name, value]) => ({ name, value }));

  sendEvent({
    eventAction: pathname,
    eventCategory: 'Open View',
    usageEventType: 'PAGE_VIEW',
    metaData: mappedSearchParameters,
  });
};

export const Routes = ({ store }) => {
  const checkFeatureToggles = withFeatureToggle(store);

  useEffectOnce(() => {
    sessionStorage.setItem('next-page', '');

    const firstPathname = transformPathname(
      hashHistory.getCurrentLocation()?.pathname,
    );

    sendPageviewEvent({ pathname: firstPathname });
    ReactGA.pageview(firstPathname);

    const removeHistoryListener = hashHistory.listen(({ action, pathname }) => {
      if (action === 'PUSH') {
        sendPageviewEvent({ pathname: transformPathname(pathname) });
        ReactGA.pageview(transformPathname(pathname));
      }
    });

    const removeHistoryLeavingListener = hashHistory.listenBefore(
      (event, hook) => {
        const locationPicker = pick(['hash', 'pathname', 'query', 'search']);

        hook(
          (event.action === 'PUSH' &&
            !equals(
              locationPicker(event),
              locationPicker(hashHistory.getCurrentLocation()),
            )) ||
            event.action === 'POP' ||
            event.action === 'REPLACE',
        );
      },
    );

    return () => {
      removeHistoryListener();
      removeHistoryLeavingListener();
    };
  });

  const adminRequired = (nextState, replaceState) => {
    const state = store.getState();

    const orgUserRole = state.userState.userProfile?.orgUserRole;

    // TODO download user profile data once and before <Routes /> render
    if (orgUserRole && !['ADMIN', 'OWNER'].includes(orgUserRole)) {
      replaceState(
        {
          nextPathname: nextState.location.pathname,
        },
        '/',
      );
    }
  };

  const checkFeatureTogglesAdmin = (nextState, replaceState) => {
    checkFeatureToggles(nextState);
    adminRequired(nextState, replaceState);
  };

  const dispatch = useDispatch();

  const checkUserIsAuthenticated = ({ checkTrialExpiration }) => {
    checkUserAuthentication({ dispatch, checkTrialExpiration });
  };

  const onEnterApp = ({ location, params }) => {
    dispatch(setLocationAndParameters({ location, params }));
  };

  const onChangeApp = (_, { location, params }) => {
    dispatch(setLocationAndParameters({ location, params }));
  };

  const handleRedirection = nextState => {
    const { params } = nextState;

    if (!params?.taskIdentifier) {
      dispatch(storeAsCurrentTask(null));
    }
  };

  const onEnterTaskGroups = nextState => {
    const { params } = nextState;

    if (params?.taskListIdentifier) {
      dispatch(onEnterTasksGroupsList());
      dispatch(getMembersByTaskListId(params?.taskListIdentifier, 'ALL'));

      dispatch(
        getFiltersForMegaFilter(
          params?.taskListIdentifier,
          params?.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE',
        ),
      );
    }
  };

  const onEnterPeopleView = nextState => {
    const { params } = nextState;

    if (params?.userIdentifier) {
      dispatch(
        getFiltersForPeopleListMegaFilter(
          params?.userIdentifier,
          params?.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE',
        ),
      );
    }
  };

  const onEnterPatientDetailsView = nextState => {
    const {
      params: { patientIdentifier },
    } = nextState;

    setHeader(dispatch)({
      layout: [
        {
          key: 'patient-header',
          component: <GenericHeader>Patient</GenericHeader>,
        },
      ],
    });
    dispatch(PatientTasksActions.initializePatient(patientIdentifier));
    dispatch(getPatient());
  };

  const onEnterPatientOpenTasksListView = () => {
    dispatch(fetchStatsForPatientTasks());
    dispatch(PatientTasksActions.setActiveTab(TaskListTabName.OPEN));
    dispatch(initalizeSavedFilters());
    dispatch(fetchPatientTasks());
    dispatch(fetchPatientFilters());
  };

  const onEnterPatientCompleteTasksListView = () => {
    dispatch(fetchStatsForPatientTasks());
    dispatch(PatientTasksActions.setActiveTab(TaskListTabName.COMPLETE));
    dispatch(initalizeSavedFilters());
    dispatch(fetchPatientTasks());
    dispatch(fetchPatientFilters());
  };

  const onEnterDashboard = () => {
    dispatch(initializeHiddenNavbarTemplate());
    dispatch(getTaskListForUser());
    dispatch(findPendingTaskListsForUser());
  };

  const onEnterDashboardTab = () => {
    dispatch(initializeDashboardView());
  };

  const onLeaveDashboard = () => {
    dispatch(removeHiddenNavbarTemplate());
    dispatch(clearFiltersForMegaFilter());
    dispatch(closeDrawer());
  };

  const onLeaveGlobalSearch = () => {
    dispatch(GlobalSearchActions.resetGlobalSearch());
    dispatch(closeDrawer());
  };

  return (
    <Router history={hashHistory}>
      <Route
        path="/"
        component={App}
        onEnter={onEnterApp}
        onChange={onChangeApp}
      >
        <Route
          component={TemplateCore}
          onEnter={() => {
            checkUserIsAuthenticated({ checkTrialExpiration: false });
          }}
        >
          <Route
            path="/userprofile"
            component={UserProfileView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/support"
            component={SupportView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/subscriptions"
            component={SubscriptionsView}
            onEnter={checkFeatureTogglesAdmin}
          />
          <Route
            path="/billing"
            component={BillingsView}
            onEnter={checkFeatureTogglesAdmin}
          />
          <Route
            path="/documents"
            component={DocumentsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/subscription-payment"
            component={SubscriptionPaymentView}
            onEnter={checkFeatureTogglesAdmin}
          />
          <Route
            path="/subscription-payment-finished"
            component={SubscriptionPaymentFinishedView}
            onEnter={checkFeatureTogglesAdmin}
          />
        </Route>
        <Route
          component={TemplateCoreSubscriptionPlan}
          onEnter={() => {
            checkUserIsAuthenticated({ checkTrialExpiration: true });
          }}
        >
          <IndexRedirect to="/home" />
          <Route
            path="/home"
            component={DashboardView}
            onEnter={nextState => {
              onEnterDashboard();
              if (nextState?.location?.pathname?.toLowerCase() === '/home') {
                hashHistory.push('/home/my-tasks');
              }
            }}
            onLeave={onLeaveDashboard}
          >
            <Route path="my-tasks" onEnter={onEnterDashboardTab} />
            <Route path="all-tasks" onEnter={onEnterDashboardTab} />
          </Route>
          <Route
            path="/search"
            component={GlobalSearchView}
            onLeave={onLeaveGlobalSearch}
          />
          <Route
            path="/patients"
            component={PatientsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/patient/:patientIdentifier"
            component={PatientDetailsView}
            onEnter={nextState => {
              checkFeatureToggles(nextState);
              onEnterPatientDetailsView(nextState);
            }}
            onLeave={() => {
              dispatch(PatientTasksActions.clearPatientTasksState());
            }}
          >
            <IndexRoute
              component={PatientTasksListView}
              onEnter={onEnterPatientOpenTasksListView}
            />
            <Route
              path="complete"
              component={PatientTasksListView}
              onEnter={onEnterPatientCompleteTasksListView}
            />
          </Route>
          <Route
            path="/editPatient/:patientIdentifier"
            component={PatientEditView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/activityfeed"
            component={TaskListActivityFeedView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/assignedToPerson/:userIdentifier(/:tabName)"
            component={PersonDetailsView}
            onEnter={nextState => {
              checkFeatureToggles(nextState);
              onEnterPeopleView(nextState);
            }}
            onLeave={() => {
              dispatch(clearFiltersForMegaFilter());
              dispatch(closeDrawer());
            }}
          />
          <Route
            path="/people"
            component={PeopleView}
            onEnter={checkFeatureToggles}
          />
          {/* <Route
            path="/tasks/inbox(/:taskIdentifier)"
            component={Inbox}
            onChange={preselectTask}
            onEnter={checkFeatureToggles}
          /> */}
          {/* DIRTY FIX -> TODO: Update react-router and use sensitive prop */}
          {/* <Route
            path="/tasks/Inbox(/:taskIdentifier)"
            component={Inbox}
            onChange={preselectTask}
            onEnter={checkFeatureToggles}
          /> */}
          <Route
            path="task-tour/:taskListIdentifier"
            component={TaskTourView}
          />
          <Route path="/tasks">
            <IndexRoute
              component={TaskListView}
              onEnter={checkFeatureToggles}
            />
            <Route
              path=":taskListIdentifier(/:tabName)(/:taskIdentifier)"
              component={ListDetailsView}
              onEnter={nextState => {
                handleRedirection(nextState);
                checkFeatureToggles(nextState);
                onEnterTaskGroups(nextState);
              }}
              onLeave={() => {
                dispatch(clearFiltersForMegaFilter());
                dispatch(closeDrawer());
                dispatch(storeAsCurrentTask(null));
              }}
            />
          </Route>
        </Route>
        <Redirect from="/onboarding/create-account" to="create-account" />
        <Route
          path="/onboarding"
          component={OnboardingTemplate}
          onEnter={() => {
            checkUserIsAuthenticated({ checkTrialExpiration: false });
          }}
        >
          <Route component={OnboardingEulaView} path="eula" />
          <Route component={OnboardingBaaOverviewView} path="baa-overview" />
          <Route component={OnboardingBaaCheckView} path="baa-check" />
          <Route component={OnboardingTrialCheckView} path="trial-check" />
          <Route
            component={OnboardingBaaInvitationSentView}
            path="baa-invitation-sent"
          />
          <Route
            component={OnboardingCreateOrganizationView}
            path="create-organization"
          />
          <Route component={OnboardingOrgSetupView} path="organization-setup" />
          <Route component={OnboardingTeamSetupView} path="team-setup" />
        </Route>
        <Route component={TemplateAuth}>
          <Route component={TemplateAuthBase}>
            <Route
              path="/confirmRegistration"
              component={ConfirmRegistration}
            />
            <Route
              path="/confirmRegistrationSuccess"
              component={ConfirmRegistrationSuccess}
            />
            <Route path="/create-account" component={CreateAccount} />
            <Route
              path="/login"
              component={LoginUser}
              onEnter={() => {
                sessionStorage.removeItem('currentOrganizationIdentifier');
              }}
            />
            <Route path="/loginUser" component={LoginPassword} />
            <Route path="/welcome" component={LoginWelcome} />
            <Route path="/logout" component={Logout} />
            <Route path="/resendCode" component={ResendCode} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Redirect from="/changePassword" to="/forgotPassword" />
            <Route path="/resetPassword" component={ResetPassword} />
            <Route path="/changePhoneNumber" component={ChangePhoneNumber} />
            <Route path="/confirmMFACode" component={ConfirmMFACode} />
            <Route path="/pagenotfound" component={PageNotFound} />
            <Route path="/errorPage" component={ErrorPage} />
            <Route path="/unEnrolledUser" component={UnEnrolledUser} />
            <Route path="/resetPasswordEmailSent" component={EmailSent} />
            <Route
              path="/resetPasswordSuccess"
              component={ResetPasswordSuccess}
            />
          </Route>
        </Route>
        <Route path="/selfEnrolledUser" component={SelfEnrolledUser} />
      </Route>
    </Router>
  );
};

export default Routes;
