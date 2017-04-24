import React from 'react'
import { Route, IndexRoute } from 'react-router';
import App from './views/App'
import TemplateCore from './views/TemplateCore'
import TemplateNoLogin from './views/TemplateNoLogin'
import Home from './views/Home'
import AddPatientView from './views/AddPatientView'
import AllPatientsView from './views/AllPatientsView'
import Register from './views/auth/Register'
import Login from './views/auth/Login'
import ConfirmRegistration from './views/auth/ConfirmRegistration'
import ResendCode from './views/auth/ResendCode'
import ForgotPassword from './views/auth/ForgotPassword'
import ResetPassword from './views/auth/ResetPassword'
import PageNotFound from './views/PageNotFound'

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
      <Route path="/patientList" component={AllPatientsView} />
      <Route path="/addPatient" component={AddPatientView} />
    </Route>
    <Route component={TemplateNoLogin} >
      <Route path="/register" component={Register} />
      <Route path="/confirmRegistration" component={ConfirmRegistration} />
      <Route path="/login" component={Login} />
      <Route path="/resendCode" component={ResendCode} />
      <Route path="/forgotPassword" component={ForgotPassword} />
      <Route path="/resetPassword" component={ResetPassword} />
    </Route>
    <Route path="/pageNotFound" component={PageNotFound} />
  </Route>
);

