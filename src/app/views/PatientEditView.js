import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {bindActionCreators} from 'redux';
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import FormPatient from '../components/patient/FormPatient'
import * as PatientActions from '../actions/patient-actions'

class PatientEditView extends React.Component {

  	componentDidMount () {
      this.props.actions.getPatientById(this.props.params.patientId);
  	}

    render() {
      var patient = {}
      if(this.props.patient){
        patient = this.props.patient
      }
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">

              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>{patient.firstName}&nbsp;{patient.lastName}</h3> 
                </div>
              </div>

              <div>
                <div className="task-item row expanded">
                  <div className="large-12 columns">
                  <FormPatient patientId={this.props.params.patientId}/>
                  </div>
                </div>
              </div>

          </div>
        </div> 
      </div> 

    );
  }

}

const mapStateToProps = function (state) {
  return {
    patient: state.patientState.selectedPatient,
    initialValues: state.patientState.selectedPatient
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientEditView);
