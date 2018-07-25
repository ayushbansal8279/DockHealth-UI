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
import Logout from './views/auth/Logout'
import ConfirmRegistration from './views/auth/ConfirmRegistration'
import ConfirmRegistrationSuccess from './views/auth/ConfirmRegistrationSuccess'
import ResendCode from './views/auth/ResendCode'
import ForgotPassword from './views/auth/ForgotPassword'
import ChangePassword from './views/auth/ChangePassword'
import ResetPassword from './views/auth/ResetPassword'
import ConfirmMFACode from './views/auth/ConfirmMFACode'
import UnEnrolledUser from './views/auth/UnEnrolledUser'
import PageNotFound from './views/PageNotFound'
import ErrorPage from './views/ErrorPage'
import TaskListView from './views/TaskListView'
import SupportSectionView from './views/SupportSectionView'
import PeopleView from './views/PeopleView';
import TaskListActivityFeedView from './views/TaskListActivityFeedView';
import TaskListSearch from './views/TaskListSearch';
import PersonTaskList from './views/PersonTaskList';
import UserProfileView from './views/UserProfileView';

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

export const Routes = (store) => {
  const authRequired = (nextState, replaceState) => {
    // Now you can access the store object here.
    const state = store.getState();
    
    if (!state.user.isAuthenticated) {
      // Not authenticated, redirect to login.
      replaceState({ nextPathname: nextState.location.pathname }, '/login');
    }
  };

  return (
    <Route path="/" component={App}>
      <Route component={TemplateCore} >
        <IndexRoute component={Home} onEnter={authRequired}/>
        <IndexRedirect to="/taskList" />
        <Route path="/patientList" component={AllPatientsView} />
        <Route path="/patient/:patientId" component={PatientView} />
        <Route path="/editPatient/:patientId" component={PatientEditView} />
        <Route path="/taskList" component={TaskListView} />
        <Route path="/activityfeed" component={TaskListActivityFeedView} />
        <Route path="/taskSearch" component={TaskListSearch} />
        <Route path="/assignedToPerson/:personId/:memberName" component={PersonTaskList} />
        <Route path="/people" component={PeopleView} />
        {/* <Route path="/peopleinvite" component={InvitePeople} /> */}
        <Route path="/tasks/:listName/:taskListId" component={Home}/>
        <Route path="/tasks/:listName" component={Home}/>
        <Route path="/tasks/:listName" component={Home}/>
        <Route path="/userprofile" component={UserProfileView} />
        <Route path="/support" component={SupportSectionView} />
        {/* <Route path="/test" component={Test} /> */}

      </Route>
      <Route component={TemplateAuth} >
        <Route component={TemplateAuthBase}>
          <Route path="/confirmRegistration" component={ConfirmRegistration}/>
          <Route path="/confirmRegistrationSuccess" component={ConfirmRegistrationSuccess}/>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/resendCode" component={ResendCode} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/changePassword" component={ChangePassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/confirmMFACode" component={ConfirmMFACode} />
          <Route path="/unEnrolledUser" component={UnEnrolledUser} />
          <Route path="/pagenotfound" component={PageNotFound} />
          <Route path="/errorPage" component={ErrorPage} />
        </Route>

        <Route path="/register" component={Register} />
      </Route>
    </Route>
  );
}

export default Routes
