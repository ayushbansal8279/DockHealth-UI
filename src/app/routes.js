import App from './views/App'
import Home from './views/Home'
import AddPatientView from './views/AddPatientView'
import AllPatientsView from './views/AllPatientsView'
import Register from './views/Register'
import ConfirmRegistration from './views/ConfirmRegistration'
import ResendCode from './views/ResendCode'
import Login from './views/Login'
import PageNotFound from './views/PageNotFound'

const routes = {
  path: '/',
  component: App,
  indexRoute: Home.route,
  childRoutes: [
    AddPatientView,
    AllPatientsView,
    Register,
    ConfirmRegistration,
    Login,
    ResendCode,
    PageNotFound
  ].map(r => r.route)
}

export default routes