import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../../actions/patient-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import PatientDropdownList from './PatientDropdownList';

class PatientDropdownListContainer extends PureComponent {
  componentWillMount() {
    this.props.actions.getAllPatients();
  }

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PatientDropdownList',
    });
  }

  render() {
    return (
      <PatientDropdownList
        patients={this.props.patients}
        addPatientToTaskCallback={this.props.addPatientToTaskCallback}
        taskIdentifier={this.props.taskIdentifier}
      />
    );
  }
}

// property validation
PatientDropdownListContainer.propTypes = {
  patients: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
  return { patients: store.patientState.allPatients };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientDropdownListContainer);
