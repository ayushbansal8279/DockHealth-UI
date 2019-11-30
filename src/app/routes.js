import React from 'react';
import { useDispatch } from 'react-redux';
import {
  hashHistory,
  IndexRedirect,
  IndexRoute,
  Route,
  Router,
} from 'react-router';

import { storeAsCurrentTask } from './actions/task-actions';
import PatientProfile from './components/patient/PatientProfile';
import Patients from './components/patients/Patients';
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
import PersonTaskList from './views/PersonTaskList';
import PeopleView from './views/PeopleView';
import SupportSectionView from './views/SupportSectionView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import TaskListSearch from './views/TaskListSearch';
import TaskListView from './views/TaskListView';
import TemplateAuth from './views/TemplateAuth';
import TemplateAuthBase from './views/TemplateAuthBase';
import TemplateCore from './views/TemplateCore';
import UserProfileViewWrapper from './views/UserProfileView.Wrapper';
import { unsetHeader } from './actions/header-actions';

export const Routes = ({ store }) => {
  const authRequired = (nextState, replaceState) => {
    // Now you can access the store object here.
    const state = store.getState();

    if (!state.user.isAuthenticated) {
      // Not authenticated, redirect to login.
      replaceState({ nextPathname: nextState.location.pathname }, '/login');
    }
  };

  const dispatch = useDispatch();

  const preselectTask = (prevState, nextState) => {
    const taskId = nextState.location?.state?.taskId;
    if (!taskId) {
      return;
    }
    dispatch(storeAsCurrentTask(taskId));
  };

  const onRouterUpdate = () => {
    unsetHeader(dispatch)();
  };

  return (
    <Router history={hashHistory} onUpdate={onRouterUpdate}>
      <Route path="/" component={App}>
        <Route component={TemplateCore}>
          <IndexRoute component={ListDetailsView} onEnter={authRequired} />
          <IndexRedirect to="/tasks" />
          <Route path="/patients" component={Patients} />
          <Route path="/patient/:patientId" component={PatientProfile} />
          <Route path="/editPatient/:patientId" component={PatientEditView} />
          <Route path="/activityfeed" component={TaskListActivityFeedView} />
          <Route path="/taskSearch" component={TaskListSearch} />
          <Route path="/assignedToPerson/:personId/:memberName" component={PersonTaskList} />
          <Route path="/people" component={PeopleView} />
          <Route
            path="/tasks/inbox(/:taskId)"
            component={Inbox}
            onChange={preselectTask}
          />
          {/* DIRTY FIX -> TODO: Update react-router and use sensitive prop */}
          <Route
            path="/tasks/Inbox(/:taskId)"
            component={Inbox}
            onChange={preselectTask}
          />
          <Route path="/tasks">
            <IndexRoute component={TaskListView} />
            <Route path="assigned_by_me" component={AssignedByMe} />
            <Route path="assigned_to_me" component={AssignedToMe} />
            <Route
              path=":listName/:taskListId(/:taskId)"
              component={ListDetailsView}
              onChange={preselectTask}
              onEnter={nextState => preselectTask(null, nextState)}
            />
            <Route
              path="filtered/:listName/:taskStatus/:filterBy"
              component={ListDetailsView}
            />
          </Route>
          <Route path="/userprofile" component={UserProfileViewWrapper} />
          <Route path="/support" component={SupportSectionView} />
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
