import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import FormPatient from '../components/patient/FormPatient'

class UpdatePatientView extends React.Component {
    render() {
    return (

      <div className="content-block">
        <div className="row">
          <div className="large-8 columns task-list-container">
            <FormPatient patientId={this.props.params.patientId}/>
          </div>
          <div className="large-4 columns sidebar">
          </div>
        </div>
      </div>

    );
  }

}

export default UpdatePatientView
