import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import PatientListContainer from '../components/patient/PatientListContainer'
import FormPatient from '../components/patient/FormPatient'

class AllPatientsView extends React.Component {
    render() {
    return ( 
        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">

                <header className="nav-down">
                <div className="top-bar">
                  <div className="top-bar-left">
                    <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                    <h3>Patients</h3> 
                  </div>
                </div>

                <div className="wrapper list-filter row expanded collapse align-middle align-right">
                  <div className="columns shrink controls">
                    <button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
                    <div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
                      <ul className="no-bullet">
                        <li>Last name</li>
                        <li className="active">MRN</li>
                      </ul>
                    </div>
                  </div>
                  <div className="columns controls">
                    <div className="input-group searchbar">
                      <input className="input-field search-field" type="search" placeholder="Search patients" />
                      <div className="input-group-button">
                        <button className="button search">
                          <svg className="icon"><use xlinkHref="#icon-search"></use></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="columns shrink">
                    <svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
                  </div>
                </div>

                </header>

                <div className="add-form-wrapper">
                  <div className="task-item add-form row expanded">
                  <div className="column large-12 text-center">
                    <h5 className="section-title">Add a patient</h5>
                  </div>
                   <FormPatient />
                  </div>
                </div>
                <PatientListContainer />
                
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