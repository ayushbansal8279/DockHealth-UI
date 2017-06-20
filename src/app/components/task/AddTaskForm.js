import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import BasicField from '../common/BasicField';

let AddTaskForm = props => {
  const { handleSubmit, taskLists, task} = props

  return (
    <form className="inline-label" onSubmit={ handleSubmit}>
      <div className="main-task-wrapper">
        <div className="column large-12 text-center">
          <h5 className="section-title">Add a task</h5>
        </div>
        <Field name='description'  type='text' component={BasicField} label='Description'/>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="add-patient" className="add-patient input-group-field" name="patient.firstName" component="input" type="text"/>
            <label>Add Patient</label>
          </div>
        </div>


        <div className="column large-12 input-group input-dropdown">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field className="input-group-field" name="taskList" component="input" type="text" data-toggle="add-task-file-in-options"/>
            <label>File in</label>
          </div>

          <div className="dropdown-pane" id="add-task-file-in-options" data-dropdown="true" data-close-on-click="true">
            <fieldset className="large-12 columns">
              {taskLists.map(taskList => {
                return(
                  <div key={taskList.taskListId} >
                    <Field id={"radio" + taskList.taskListId} className="input-group-field" name="taskList" value={taskList.taskListId.toString()} component="input" type="radio" /><label htmlFor={"radio" + taskList.taskListId}>{taskList.listName}</label><br/>
                  </div>
                )
              })}
            </fieldset>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="assign-task-to" className="assign-to input-group-field" name="assignedTo.userName" component="input" type="text" />
            <label>Assigned to</label>
          </div>
        </div>

        <div className="column large-12 input-group toggle-add-subtask">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field className="input-group-field" name="subtask" component="input" type="text" />
            <label>Add a subtask</label>
          </div>
        </div>

        <div className="column large-12 text-right text-center">
          <input type="submit" className="button secondary medium" value="Save"/>
        </div>
      </div>

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

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="add-patient-subtask" className="add-patient input-group-field" name="patient" component="input" type="text" />
            <label>Add Patient</label>
          </div>
        </div>

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

    </form>
  )
}

AddTaskForm = reduxForm({
  // a unique name for the form
  form: 'addTaskForm',
  enableReinitialize : true
})(AddTaskForm)

const mapStateToProps = function(store) {
  return {
		initialValues: store.taskState.task,
    tasks: store.taskState.tasks
  	}
};

export default connect(mapStateToProps)(AddTaskForm);
