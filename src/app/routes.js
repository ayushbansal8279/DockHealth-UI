import React from 'react'
import { Route, IndexRoute } from 'react-router';
import App from './views/App'
import TemplateCore from './views/TemplateCore'
import TemplateNoLogin from './views/TemplateNoLogin'
import Home from './views/Home'
import AddPatientView from './views/AddPatientView'
import UpdatePatientView from './views/UpdatePatientView'
import AllPatientsView from './views/AllPatientsView'
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
      // <IndexRoute component={Home} />
      <Route path="/patientList" component={AllPatientsView} />
      <Route path="/addPatient" component={AddPatientView} />
      <Route path="/updatePatient/:patientId" component={UpdatePatientView} />
      <Route path="/taskList" component={TaskListView} />
      <Route path="/addTaskList" component={TaskListAdd} />
      <Route path="/updateTaskList/:taskListId" component={TaskListUpdateView} />
      <Route path="/viewTaskListMembers/:taskListId" component={TaskListMembersView} />
      <Route path="/invitePersonToTaskList/:taskListId" component={TaskListInvitePersonView} />
      <Route path="/inviteUsersToTaskList/:taskListId" component={TaskListInviteUserView} />
      <Route path="/updateUserRole/:taskListId" component={TaskListUpdateUserRoleView} />
      <Route path="/invitations" component={InvitationsView} />
      <Route path="/people" component={PeopleView} />
      <Route path="/peopleinvite" component={InvitePeople} />
    </Route>
    <Route component={TemplateNoLogin} >
      <Route path="/register" component={Register} />
      <Route path="/confirmRegistration" component={ConfirmRegistration} />
      <Route path="/login" component={Login} />
      <Route path="/resendCode" component={ResendCode} />
      <Route path="/forgotPassword" component={ForgotPassword} />
      <Route path="/resetPassword" component={ResetPassword} />
      <Route path="/confirmMFACode" component={ConfirmMFACode} />
    </Route>
  </Route>
);
