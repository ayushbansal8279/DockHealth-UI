import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from 'actions/patient-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import FormPatient from 'components/patient/FormPatient';

class PatientEditView extends PureComponent {
  componentDidMount() {
    const { params, actions } = this.props;
    actions.getPatientById(params.patientIdentifier);

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PatientEdit',
    });
  }

  render() {
    const patient = this.props.patient || {};

    return (
      <div className="off-canvas-content" data-off-canvas-content="true">
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="top-bar">
              <div className="top-bar-left">
                <button
                  className="menu-icon hide-for-medium"
                  type="button"
                  data-toggle="sidebar"
                />
                <h3>
                  {patient.firstName}
                  &nbsp;
                  {patient.lastName}
                </h3>
              </div>
            </div>

            <div>
              <div className="task-item row expanded">
                <div className="large-12 columns">
                  <FormPatient
                    patientIdentifier={this.props.params.patientIdentifier}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  patient: state.patientState.selectedPatient,
  initialValues: state.patientState.selectedPatient,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(PatientActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientEditView);
