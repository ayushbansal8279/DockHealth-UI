import { equals, pick } from 'ramda';
import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import {
  hashHistory,
  IndexRedirect,
  IndexRoute,
  Redirect,
  Route,
  Router,
} from 'react-router';
import { useEffectOnce } from 'react-use';
import { storeAsCurrentTask } from './actions/task-actions';
import PatientDetailsView from './components/patient/PatientDetailsView';
import PatientsView from './components/patients/PatientsView';
import handleFeatureToggle from './helpers/handle-feature-toggle';
import App from './views/App';
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
import Inbox from './views/Inbox';
import ListDetailsView from './views/ListDetailsView';
import OnboardingBaaCheckView from './views/onboarding/onboarding-baa-check/OnboardingBaaCheckView';
import OnboardingBaaInvitationSentView from './views/onboarding/onboarding-baa-invitation-sent/OnboardingBaaInvitationSentView';
import OnboardingBaaOverviewView from './views/onboarding/onboarding-baa-overview/OnboardingBaaOverviewView';
import OnboardingEulaView from './views/onboarding/onboarding-eula/OnboardingEulaView';
import OnboardingProfileView from './views/onboarding/onboarding-profile/OnboardingProfileView';
import OnboardingTeamOrgSetupView from './views/onboarding/onboarding-team-org-setup/OnboardingTeamOrgSetupView';
import OnboardingTrialCheckView from './views/onboarding/onboarding-trial-check/OnboardingTrialCheckView';
import OnboardingTemplate from './views/onboarding/OnboardingTemplate';
import PageNotFound from './views/PageNotFound';
import PatientEditView from './views/PatientEditView';
import PeopleView from './views/PeopleView';
import PersonDetailsView from './views/PersonDetailsView';
import BillingsView from './views/self-serve/billings/BillingsView';
import DocumentsView from './views/self-serve/documents/DocumentsView';
import SubscriptionPaymentFinishedView from './views/self-serve/subscription-payment/SubscriptionPaymentFinishedView';
import SubscriptionPaymentView from './views/self-serve/subscription-payment/SubscriptionPaymentView';
import SubscriptionsView from './views/self-serve/subscriptions/SubscriptionsView';
import SupportView from './views/SupportView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import TaskListSearch from './views/TaskListSearch';
import TaskListView from './views/TaskListView';
import TemplateAuth from './views/TemplateAuth';
import TemplateAuthBase from './views/TemplateAuthBase';
import TemplateCore from './views/TemplateCore';
import TemplateCoreSubscriptionPlan from './views/TemplateCoreSubscriptionPlan';
import UserProfileViewWrapper from './views/UserProfileView.Wrapper';

const transformPathname = pathname =>
  decodeURIComponent(pathname).replace(/^\//, '');

const withFeatureToggle = store => ({ location }) => {
  const user = store.getState().userState?.userProfile;

  if (user?.userIdentifier) {
    handleFeatureToggle({ location, user });
  }
};

export const Routes = ({ store }) => {
  const checkFeatureToggles = withFeatureToggle(store);

  useEffectOnce(() => {
    sessionStorage.setItem('next-page', '');

    const firstPathname = transformPathname(
      hashHistory.getCurrentLocation()?.pathname,
    );
    ReactGA.pageview(firstPathname);

    const removeHistoryListener = hashHistory.listen(({ action, pathname }) => {
      if (action === 'PUSH') {
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

  const preselectTask = (_, nextState) => {
    const taskIdentifier = nextState.location?.state?.taskIdentifier;
    if (!taskIdentifier) {
      return;
    }
    dispatch(storeAsCurrentTask(taskIdentifier));
  };

  return (
    <Router history={hashHistory} onUpdate={() => {}}>
      <Route path="/" component={App}>
        <Route component={TemplateCore}>
          <IndexRoute
            component={ListDetailsView}
            onEnter={checkFeatureToggles}
          />
          <IndexRedirect to="/tasks" />
          <Route
            path="/userprofile"
            component={UserProfileViewWrapper}
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
        <Route component={TemplateCoreSubscriptionPlan}>
          <Route
            path="/patients"
            component={PatientsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/patient/:patientIdentifier"
            component={PatientDetailsView}
            onEnter={checkFeatureToggles}
          />
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
            path="/taskSearch"
            component={TaskListSearch}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/assignedToPerson/:userIdentifier"
            component={PersonDetailsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/people"
            component={PeopleView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/tasks/inbox(/:taskIdentifier)"
            component={Inbox}
            onChange={preselectTask}
            onEnter={checkFeatureToggles}
          />
          {/* DIRTY FIX -> TODO: Update react-router and use sensitive prop */}
          <Route
            path="/tasks/Inbox(/:taskIdentifier)"
            component={Inbox}
            onChange={preselectTask}
            onEnter={checkFeatureToggles}
          />
          <Route path="/tasks">
            <IndexRoute
              component={TaskListView}
              onEnter={checkFeatureToggles}
            />
            <Route
              path=":taskListIdentifier(/:taskIdentifier)"
              component={ListDetailsView}
              onChange={preselectTask}
              onEnter={nextState => {
                checkFeatureToggles(nextState);
                preselectTask(null, nextState);
              }}
            />
            <Route
              path="filtered/:listName/:taskStatus/:filterBy"
              component={ListDetailsView}
              onEnter={checkFeatureToggles}
            />
          </Route>
        </Route>
        <Redirect from="/onboarding/create-account" to="create-account" />
        <Route path="/onboarding" component={OnboardingTemplate}>
          <Route component={OnboardingEulaView} path="eula" />
          <Route component={OnboardingBaaOverviewView} path="baa-overview" />
          <Route component={OnboardingBaaCheckView} path="baa-check" />
          <Route component={OnboardingTrialCheckView} path="trial-check" />
          <Route
            component={OnboardingBaaInvitationSentView}
            path="baa-invitation-sent"
          />
          <Route component={OnboardingTeamOrgSetupView} path="team-org-setup" />
          <Route component={OnboardingProfileView} path="profile" />
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
            <Route path="/login" component={LoginUser} />
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
