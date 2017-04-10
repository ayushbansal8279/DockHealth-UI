import React from 'react'
import {connect} from 'react-redux'
import PatientList from './PatientList'
import * as PatientApi from '../../api/patient-api'
import store from '../../store'

const PatientListContainer = React.createClass({

    componentDidMount: function () {
        PatientApi.getAllPatients()
    },

    render: function () {
        return (<PatientList patients={this.props.patients}/>);
    }

});

const mapStateToProps = function (store) {
    return {patients: store.patientState.allPatients};
};

export default connect(mapStateToProps)(PatientListContainer);
