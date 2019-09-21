import React from 'react';
import {
  Route, IndexRoute, IndexRedirect, hashHistory, Router,
} from 'react-router';
import { useDispatch } from 'react-redux';
import App from './views/App';
import TemplateCore from './views/TemplateCore';
import TemplateAuth from './views/TemplateAuth';
import TemplateAuthBase from './views/TemplateAuthBase';
import Home from './views/Home';
import Inbox from './views/Inbox';
import AssignedByMe from './views/AssignedByMe';
import AssignedToMe from './views/AssignedToMe';
import AllPatientsView from './views/AllPatientsView';
import PatientView from './views/PatientView';
import PatientEditView from './views/PatientEditView';
import Register from './views/auth/Register';
import Login from './views/auth/Login';
import LoginUser from './views/auth/LoginUser';
import Logout from './views/auth/Logout';
import ConfirmRegistration from './views/auth/ConfirmRegistration';
import ConfirmRegistrationSuccess from './views/auth/ConfirmRegistrationSuccess';
import ResendCode from './views/auth/ResendCode';
import ForgotPassword from './views/auth/ForgotPassword';
import ChangePassword from './views/auth/ChangePassword';
import ResetPassword from './views/auth/ResetPassword';
import ConfirmMFACode from './views/auth/ConfirmMFACode';
import UnEnrolledUser from './views/auth/UnEnrolledUser';
import SelfEnrolledUser from './views/auth/SelfEnrolledUser';
import PageNotFound from './views/PageNotFound';
import ErrorPage from './views/ErrorPage';
import TaskListView from './views/TaskListView';
import SupportSectionView from './views/SupportSectionView';
import PeopleView from './views/PeopleView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import TaskListSearch from './views/TaskListSearch';
import PersonTaskList from './views/PersonTaskList';
import UserProfileView from './views/UserProfileView';
import Patients from './components/patients/Patients';
import { storeAsCurrentTask } from './actions/task-actions';

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

  return (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route component={TemplateCore}>
          <IndexRoute component={Home} onEnter={authRequired} />
          <IndexRedirect to="/taskList" />
          <Route path="/patientList" component={AllPatientsView} />
          <Route path="/patients" component={Patients} />
          <Route path="/patient/:patientId" component={PatientView} />
          <Route path="/editPatient/:patientId" component={PatientEditView} />
          <Route path="/taskList" component={TaskListView} />
          <Route path="/activityfeed" component={TaskListActivityFeedView} />
          <Route path="/taskSearch" component={TaskListSearch} />
          <Route path="/assignedToPerson/:personId/:memberName" component={PersonTaskList} />
          <Route path="/people" component={PeopleView} />
          <Route
            path="/tasks/(inbox|Inbox)(/:taskId)"
            component={Inbox}
            onChange={preselectTask}
          />
          {/* DIRTY FIX -> TODO: Update react-router and use sensitive prop */}
          <Route
            path="/tasks/Inbox(/:taskId)"
            component={Inbox}
            onChange={preselectTask}
          />
          <Route path="/tasks/assigned_by_me" component={AssignedByMe} />
          <Route path="/tasks/assigned_to_me" component={AssignedToMe} />
          <Route
            path="/tasks/:listName/:taskListId(/:taskId)"
            component={Home}
            onChange={preselectTask}
            onEnter={nextState => preselectTask(null, nextState)}
          />
          <Route path="/userprofile" component={UserProfileView} />
          <Route path="/support" component={SupportSectionView} />
        </Route>
        <Route component={TemplateAuth}>
          <Route component={TemplateAuthBase}>
            <Route path="/confirmRegistration" component={ConfirmRegistration} />
            <Route path="/confirmRegistrationSuccess" component={ConfirmRegistrationSuccess} />
            <Route path="/login" component={Login} />
            <Route path="/loginUser" component={LoginUser} />
            <Route path="/logout" component={Logout} />
            <Route path="/resendCode" component={ResendCode} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/changePassword" component={ChangePassword} />
            <Route path="/resetPassword" component={ResetPassword} />
            <Route path="/confirmMFACode" component={ConfirmMFACode} />
            <Route path="/pagenotfound" component={PageNotFound} />
            <Route path="/errorPage" component={ErrorPage} />
            <Route path="/unEnrolledUser" component={UnEnrolledUser} />
          </Route>
          <Route path="/register" component={Register} />
        </Route>
        <Route path="/selfEnrolledUser" component={SelfEnrolledUser} />
      </Route>
    </Router>
  );
};

export default Routes;
