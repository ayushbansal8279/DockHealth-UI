import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import PatientDropdownList from './PatientDropdownList'
import * as PatientActions from '../../actions/patient-actions'

class PatientDropdownListContainer extends React.Component {
    componentWillMount () {
        this.props.actions.getAllPatients()
    }

    render() {
        return (
          <PatientDropdownList patients={this.props.patients} addPatientToTaskCallback={this.props.addPatientToTaskCallback} taskId={this.props.taskId}/>
        )
    }
}

//property validation
PatientDropdownListContainer.propTypes = {
    patients: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = function (store) {
    return {patients: store.patientState.allPatients};
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientDropdownListContainer);
