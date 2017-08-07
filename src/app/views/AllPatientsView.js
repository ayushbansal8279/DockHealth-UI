import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import * as PatientActions from '../actions/patient-actions'
import PatientListContainer from '../components/patient/PatientListContainer'
import SearchPatient from '../components/patient/SearchPatient'
import FormPatient from '../components/patient/FormPatient'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponent from '../components/BaseComponent'

class AllPatientsView extends BaseComponent {

    constructor(props){
      super(props)
      this.state = {
        searchTerm: ''
      }
    }
    componentDidMount(){
      this.props.patientActions.loading()
      this.props.patientActions.getAllPatients()
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'AllPatientsView'
			});
    }
    clearSearch = () => {
      this.setState({searchTerm: ''})
    }
    searchUpdated = (term) => {
      this.setState({searchTerm: term.target.value})
    }
    refresh = () => {
      this.props.patientActions.loading()
      this.props.patientActions.getAllPatients()
    }
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

                <div className="wrapper list-filter row collapse align-middle align-right">
                  {/*<div className="columns shrink controls">
                    <button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
                    <div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
                      <ul className="no-bullet">
                        <li>Last name</li>
                        <li className="active">MRN</li>
                      </ul>
                    </div>
                  </div>*/}
                  <div className="columns controls">
                    <div className="input-group searchbar">
                      <input className="input-field search-field" type="search" placeholder="Search patients" onChange={this.searchUpdated} value={this.state.searchTerm}/>
                      <div className="input-group-button">
                        <button className="button search">
                          <svg onClick={this.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="columns shrink icon-group controls">
                    <span onClick={(e) => this.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
                  </div>
                  <div className="columns shrink">
                    <svg className="add icon"><use xlinkHref="#icon-add-patient"></use></svg>
                  </div>
                </div>

                </header>

                <div className="add-form-wrapper">
                  <div className="task-item add-form row expanded">
                  <div className="column large-12 text-center">
                    <h5 className="section-title">Add a patient</h5>
                  </div>
                  <SearchPatient />
									<div className="column large-12 text-center">
										Search for an existing patient in the database
									</div>
									<div className="column large-12 text-center">
										or enter patient manually
									</div>
                  <FormPatient />
                  </div>
                </div>
                <div className="list-wrapper">
                  {this.props.isFetching ?
                    <div className="sk-circle">
                      <div className="sk-circle1 sk-child"></div>
                      <div className="sk-circle2 sk-child"></div>
                      <div className="sk-circle3 sk-child"></div>
                      <div className="sk-circle4 sk-child"></div>
                      <div className="sk-circle5 sk-child"></div>
                      <div className="sk-circle6 sk-child"></div>
                      <div className="sk-circle7 sk-child"></div>
                      <div className="sk-circle8 sk-child"></div>
                      <div className="sk-circle9 sk-child"></div>
                      <div className="sk-circle10 sk-child"></div>
                      <div className="sk-circle11 sk-child"></div>
                      <div className="sk-circle12 sk-child"></div>
                    </div>:
                    <PatientListContainer searchTerm={this.state.searchTerm}/>
                  }
                </div>


          </div>
        </div>
      </div>

    );
  }
}

const mapStateToProps = function (store) {
  return{
    isFetching: store.patientState.isFetching
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPatientsView);

// AllPatientsView.route = {
//   path: 'patientList',
//   component: AllPatientsView
// }
