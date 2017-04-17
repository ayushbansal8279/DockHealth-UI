import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

// Links this container component to PatientDropdownList component
import PatientDropdownList from './PatientDropdownList'

// Gets all actions listed in patient-actions
import * as PatientActions from '../../actions/patient-actions'

class PatientDropdownListContainer extends React.Component {
    componentDidMount () {
        this.props.actions.getAllPatients()
    }

    render() {
        return (<PatientList patients={this.props.patients}/>)
    }
}

//property validation
PatientListContainer.propTypes = {  
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

export default connect(mapStateToProps, mapDispatchToProps)(PatientListContainer);
