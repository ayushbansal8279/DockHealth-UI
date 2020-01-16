import { equals, pick } from 'ramda';
import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import {
  hashHistory,
  IndexRedirect,
  IndexRoute,
  Route,
  Router,
} from 'react-router';
import { useEffectOnce } from 'react-use';

import { unsetHeader } from './actions/header-actions';
import { storeAsCurrentTask } from './actions/task-actions';
import PatientProfile from './components/patient/PatientProfile';
import Patients from './components/patients/Patients';
import handleFeatureToggle from './helpers/handle-feature-toggle';
import App from './views/App';
import AssignedByMe from './views/AssignedByMe';
import AssignedToMe from './views/AssignedToMe';
import ChangePassword from './views/auth/ChangePassword';
import ConfirmMFACode from './views/auth/ConfirmMFACode';
import ConfirmRegistration from './views/auth/ConfirmRegistration';
import ConfirmRegistrationSuccess from './views/auth/ConfirmRegistrationSuccess';
import EmailSent from './views/auth/EmailSent';
import ForgotPassword from './views/auth/ForgotPassword';
import LoginPassword from './views/auth/LoginPassword';
import LoginUser from './views/auth/LoginUser';
import Logout from './views/auth/Logout';
import Register from './views/auth/Register';
import ResendCode from './views/auth/ResendCode';
import ResetPassword from './views/auth/ResetPassword';
import ResetPasswordSuccess from './views/auth/ResetPasswordSuccess';
import SelfEnrolledUser from './views/auth/SelfEnrolledUser';
import UnEnrolledUser from './views/auth/UnEnrolledUser';
import ErrorPage from './views/ErrorPage';
import Inbox from './views/Inbox';
import ListDetailsView from './views/ListDetailsView';
import PageNotFound from './views/PageNotFound';
import PatientEditView from './views/PatientEditView';
import PeopleView from './views/PeopleView';
import PersonTaskList from './views/PersonTaskList';
import BillingsView from './views/self-serve/billings/BillingsView';
import DocumentsView from './views/self-serve/documents/DocumentsView';
import SubscriptionsView from './views/self-serve/subscriptions/SubscriptionsView';
import SupportSectionView from './views/SupportSectionView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import TaskListSearch from './views/TaskListSearch';
import TaskListView from './views/TaskListView';
import TemplateAuth from './views/TemplateAuth';
import TemplateAuthBase from './views/TemplateAuthBase';
import TemplateCore from './views/TemplateCore';
import UserProfileViewWrapper from './views/UserProfileView.Wrapper';

const transformPathname = pathname =>
  decodeURIComponent(pathname).replace(/^\//, '');

const withFeatureToggle = store => ({ location }) => {
  const user = store.getState().userState?.userProfile;

  if (user) {
    handleFeatureToggle({ location, user });
  }
};

export const Routes = ({ store }) => {
  const checkFeatureToggles = withFeatureToggle(store);

  useEffectOnce(() => {
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
          !equals(
            locationPicker(event),
            locationPicker(hashHistory.getCurrentLocation()),
          ),
        );
      },
    );

    return () => {
      removeHistoryListener();
      removeHistoryLeavingListener();
    };
  });

  const authRequired = (nextState, replaceState) => {
    const state = store.getState();

    if (!state.userState.userProfile?.userId) {
      replaceState(
        {
          nextPathname: nextState.location.pathname,
        },
        '/login',
      );
    }
  };

  const dispatch = useDispatch();

  const preselectTask = (previousState, nextState) => {
    const taskId = nextState.location?.state?.taskId;
    if (!taskId) {
      return;
    }
    dispatch(storeAsCurrentTask(taskId));
  };

  function onRouterUpdate() {
    unsetHeader(dispatch)();
  }

  return (
    <Router history={hashHistory} onUpdate={onRouterUpdate}>
      <Route path="/" component={App}>
        <Route component={TemplateCore}>
          <IndexRoute component={ListDetailsView} onEnter={authRequired} />
          <IndexRedirect to="/tasks" />
          <Route
            path="/patients"
            component={Patients}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/patient/:patientId"
            component={PatientProfile}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/editPatient/:patientId"
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
            path="/assignedToPerson/:email"
            component={PersonTaskList}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/people"
            component={PeopleView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/tasks/inbox(/:taskId)"
            component={Inbox}
            onChange={preselectTask}
            onEnter={checkFeatureToggles}
          />
          {/* DIRTY FIX -> TODO: Update react-router and use sensitive prop */}
          <Route
            path="/tasks/Inbox(/:taskId)"
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
              path="assigned_by_me"
              component={AssignedByMe}
              onEnter={checkFeatureToggles}
            />
            <Route
              path="assigned_to_me"
              component={AssignedToMe}
              onEnter={checkFeatureToggles}
            />
            <Route
              path=":listName/:taskListId(/:taskId)"
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
          <Route
            path="/userprofile"
            component={UserProfileViewWrapper}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="/support"
            component={SupportSectionView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="subscriptions"
            component={SubscriptionsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="billings"
            component={BillingsView}
            onEnter={checkFeatureToggles}
          />
          <Route
            path="documents"
            component={DocumentsView}
            onEnter={checkFeatureToggles}
          />
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
            <Route path="/login" component={LoginUser} />
            <Route path="/loginUser" component={LoginPassword} />
            <Route path="/logout" component={Logout} />
            <Route path="/resendCode" component={ResendCode} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/changePassword" component={ChangePassword} />
            <Route path="/resetPassword" component={ResetPassword} />
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
          <Route path="/register" component={Register} />
        </Route>
        <Route path="/selfEnrolledUser" component={SelfEnrolledUser} />
      </Route>
    </Router>
  );
};

export default Routes;
