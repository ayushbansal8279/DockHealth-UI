import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import PatientListContainer from '../components/patient/PatientListContainer'

class AllPatientsView extends React.Component {
    render() {
    return ( 
      <div className="content-block">
        <div className="row">
          <div className="large-8 columns task-list-container">
            <PatientListContainer />
          </div>
          <div className="large-4 columns sidebar">
          </div>
        </div>
      </div>

    );
  }
}

export default AllPatientsView

// AllPatientsView.route = {
//   path: 'patientList',
//   component: AllPatientsView
// }