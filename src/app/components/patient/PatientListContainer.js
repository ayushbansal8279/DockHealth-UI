import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../../actions/patient-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import PatientList from './PatientList';

class PatientListContainer extends PureComponent {
  componentDidMount() {
    this.props.actions.getAllPatients();
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PatientList',
    });
  }

  deletePatient = patientId => {
    this.props.actions.deletePatient(patientId);
  };

  render() {
    const KEYS_TO_FILTERS = ['firstName', 'lastName', 'email', 'mrn'];
    // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
    let filteredPatients = [];
    if (this.props.patients) {
      filteredPatients = this.props.patients.filter(
        createFilter(this.props.searchTerm, KEYS_TO_FILTERS),
      );
    }
    return <PatientList patients={filteredPatients} />;
  }
}

// property validation
PatientListContainer.propTypes = {
  patients: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
  return {
    patients: store.patientState.allPatients,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientListContainer);
