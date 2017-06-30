import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './views/App'
import TemplateCore from './views/TemplateCore'
import TemplateAuth from './views/TemplateAuth'
import TemplateAuthBase from './views/TemplateAuthBase'
import Home from './views/Home'
import AllPatientsView from './views/AllPatientsView'
import PatientView from './views/PatientView'
import PatientEditView from './views/PatientEditView'
import Register from './views/auth/Register'
import Login from './views/auth/Login'
import ConfirmRegistration from './views/auth/ConfirmRegistration'
import ResendCode from './views/auth/ResendCode'
import ForgotPassword from './views/auth/ForgotPassword'
import ResetPassword from './views/auth/ResetPassword'
import ConfirmMFACode from './views/auth/ConfirmMFACode'
import PageNotFound from './views/PageNotFound'
import TaskListView from './views/TaskListView'
import TaskListAdd from './components/tasklist/TaskListAdd';
import TaskListUpdateView from './views/TaskListUpdateView';
import TaskListMembersView from './views/TaskListMembersView';
import TaskListInvitePersonView from './views/TaskListInvitePersonView';
import TaskListInviteUserView from './views/TaskListInviteUserView';
import TaskListUpdateUserRoleView from './views/TaskListUpdateUserRoleView';
import InvitationsView from './views/InvitationsView';
import PeopleView from './views/PeopleView';
import InvitePeople from './components/people/InvitePeople';
import TaskListAuditView from './views/TaskListAuditView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import UserProfileView from './views/UserProfileView';
import Test from './views/Test';

// const routes = {
//   path: '/',
//   component: App,
//   indexRoute: Home.route,
//   childRoutes: [
//     AddPatientView,
//     AllPatientsView,
//     Register,
//     ConfirmRegistration,
//     Login,
//     ResendCode,
//     PageNotFound
//   ].map(r => r.route)
// }

// export default routes

export default (
  <Route path="/" component={App}>
    <Route component={TemplateCore} >
      <IndexRoute component={Home} />
      <IndexRedirect to="/tasks/Inbox"/>
      <Route path="/patientList" component={AllPatientsView} />
      <Route path="/patient/:patientId" component={PatientView} />
      <Route path="/editPatient/:patientId" component={PatientEditView} />
      <Route path="/taskList" component={TaskListView} />
      <Route path="/activityfeed" component={TaskListActivityFeedView} />
      <Route path="/addTaskList" component={TaskListAdd} />
      <Route path="/updateTaskList/:taskListId" component={TaskListUpdateView} />
      <Route path="/viewTaskListAudits/:taskListId" component={TaskListAuditView} />
      <Route path="/viewTaskListMembers/:taskListId" component={TaskListMembersView} />
      <Route path="/invitePersonToTaskList/:taskListId" component={TaskListInvitePersonView} />
      <Route path="/inviteUsersToTaskList/:taskListId" component={TaskListInviteUserView} />
      <Route path="/updateUserRole/:taskListId" component={TaskListUpdateUserRoleView} />
      <Route path="/invitations" component={InvitationsView} />
      <Route path="/people" component={PeopleView} />
      <Route path="/peopleinvite" component={InvitePeople} />
      <Route path="/tasks/:listName/:taskListId" component={Home}/>
      <Route path="/tasks/:listName" component={Home}/>
      <Route path="/tasks/:listName" component={Home}/>
      <Route path="/userprofile" component={UserProfileView} />
      <Route path="/test" component={Test} />
    </Route>
    <Route component={TemplateAuth} >
      <Route component={TemplateAuthBase}>
        <Route path="/confirmRegistration" component={ConfirmRegistration}/>
        <Route path="/login" component={Login} />
        <Route path="/resendCode" component={ResendCode} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/resetPassword" component={ResetPassword} />
        <Route path="/confirmMFACode" component={ConfirmMFACode} />
      </Route>
      <Route path="/register" component={Register} />
    </Route>
  </Route>
);
