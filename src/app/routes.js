import React from 'react'
import { Route, IndexRoute } from 'react-router';
import App from './views/App'
import Home from './views/Home'
import AddPatientView from './views/AddPatientView'
import AllPatientsView from './views/AllPatientsView'
import Register from './views/Register'
import ConfirmRegistration from './views/ConfirmRegistration'
import ResendCode from './views/ResendCode'
import Login from './views/Login'
import PageNotFound from './views/PageNotFound'
import TaskListView from './views/TaskListView'
import Test from './views/Test'

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
    <IndexRoute component={Home} />
    <Route path="/taskList" component={TaskListView} />
    <Route path="/patientList" component={AllPatientsView} />
    <Route path="/addPatient" component={AddPatientView} />
    <Route path="/register" component={Register} />
    <Route path="/confirmRegistration" component={ConfirmRegistration} />
    <Route path="/login" component={Login} />
    <Route path="/resendCode" component={ResendCode} />
    <Route path="/pageNotFound" component={PageNotFound} />
    <Route path="/test" component={Test} />
  </Route>
);
