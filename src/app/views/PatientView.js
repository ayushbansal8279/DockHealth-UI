import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {bindActionCreators} from 'redux';
import Moment from 'react-moment'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import * as PatientActions from '../actions/patient-actions'
import {mobileAnalyticsClient} from '../api/analytics-api'

class PatientView extends React.Component {
  	componentDidMount () {
      this.props.actions.getPatientById(this.props.params.patientId);
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'PatientView'
      });
  	}

    componentWillUnmount(){
      closeAddForm()
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
                <div className="top-bar-right">
                  <div className="icon-text-wrapper">
                    <Link to={"/editPatient/"+patient.patientId} key={patient.patientId}>
                    <svg className="icon"><use xlinkHref="#icon-pencil"></use></svg> Edit
                    </Link>
                  </div>
                </div>
              </div>

              <div className="wrapper slim">
                <div className="item condense row expanded align-middle">
                  <div className="columns large-4">
                    <span className="item-details">MRN</span>
                    <span className="item-content">{patient.mrn}</span>
                  </div>

                  <div className="columns large-4">
                    <span className="item-details">Gender</span>
                    <span className="item-content">{patient.gender}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Birthday</span>
                    <span className="item-content"><Moment format="MMM DD, YYYY">{patient.dob}</Moment></span>
                  </div>
                </div>

                <div className="item condense row expanded align-middle">
                  <div className="columns large-4">
                    <span className="item-details">Phone</span>
                    <span className="item-content">{patient.phoneHome}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Cell</span>
                    <span className="item-content">{patient.phoneMobile}</span>
                  </div>
                  <div className="columns large-4">
                    <span className="item-details">Email</span>
                    <span className="item-content">{patient.email}</span>
                  </div>
                </div>

                <div className="item row condense expanded align-middle">
                  <div className="columns large-12">
                    <span className="item-details">Notes</span>
                    <span className="item-content">{patient.notes}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PatientView);
