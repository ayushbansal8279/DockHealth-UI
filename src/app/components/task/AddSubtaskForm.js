import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

class AddSubtaskForm extends React.Component{

  render(){
    return(
      <div className="subtask-wrapper">
        <div className="row expanded">
          <div className="column small-4 toggle-add-subtask">
            <svg className="icon"><use xlinkHref="#icon-arrow-left"></use></svg>
          </div>
          <div className="column small-4 text-center">
            <h5 className="section-title">Add a subtask</h5>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field className="input-group-field" name="subtaskDescription" component="input" type="text" />
            <label>Subtask</label>
          </div>
        </div>

        {/*<div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="add-patient-subtask" className="add-patient input-group-field" name="patient" component="input" type="text" />
            <label>Add Patient</label>
          </div>
        </div>*/}

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="assign-subtask-to" className="assign-to input-group-field" name="assignedTo" component="input" type="text" />
            <label>Assigned to</label>
          </div>
        </div>

        <div className="column large-12 text-right">
          <button type="submit" className="button secondary float-right button-small">Save</button>
        </div>
      </div>
    )
  }
}

AddSubtaskForm = reduxForm({
  // a unique name for the form
  form: 'addSubtaskForm',
  enableReinitialize : true
})(AddSubtaskForm)

const mapStateToProps = function(store){

  }
  // var initialValues = {}
  // if(this.props.taskList){
  //   initialValues = this.props.taskList
  // }
  // return{
  //   initialValues: initialValues
  // }
}

export default connect(mapStateToProps)(AddSubtaskForm)
