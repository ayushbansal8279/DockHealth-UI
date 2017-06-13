import React from 'react'
import { Field, reduxForm } from 'redux-form'

let AddTaskForm = props => {
  let { handleSubmit } = props
  return (
    // <form onSubmit={ handleSubmit }>
    //   <div>
    //     <label htmlFor="firstName">First Name</label>
    //     <Field name="firstName" component="input" type="text" />
    //   </div>
    //   <div>
    //     <label htmlFor="lastName">Last Name</label>
    //     <Field name="lastName" component="input" type="text" />
    //   </div>
    //   <div>
    //     <label htmlFor="email">Email</label>
    //     <Field name="email" component="input" type="email" />
    //   </div>
    //   <button type="submit">Submit</button>
    // </form>
    <form className="inline-label">
      <div className="main-task-wrapper">
        <div className="column large-12 text-center">
          <h5 className="section-title">Add a task</h5>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="input-group-field" type="text"/>
            <label>Task</label>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input id="add-patient" className="add-patient input-group-field" type="text"/>
            <label>Add Patient</label>
          </div>
        </div>

        <div className="column large-12 input-group input-dropdown">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="input-group-field" type="text" data-toggle="add-task-file-in-options"/>
            <label>File in</label>
          </div>

          <div className="dropdown-pane" id="add-task-file-in-options" data-dropdown="true" data-close-on-click="true">
            <fieldset className="large-12 columns">
              <input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Inbox</label><br/>
              <input id="checkbox2" type="checkbox"/><label htmlFor="checkbox2">Boston Clinic (Mike Docktor)</label><br/>
              <input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">Waltham Clinic (Mike Docktor)</label>
            </fieldset>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input id="assign-task-to" className="assign-to input-group-field" type="text"/>
            <label>Assigned to</label>
          </div>
        </div>

        <div className="column large-12 input-group has-value">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="pickdate input-group-field" type="text" value=""/>
            <label>Due date</label>
          </div>
        </div>

        <div className="column large-12 input-group toggle-add-subtask">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="input-group-field" type="text"/>
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
            <input className="input-group-field" type="text"/>
            <label>Subtask</label>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input id="add-patient-subtask" className="add-patient input-group-field" type="text"/>
            <label>Add Patient</label>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input id="assign-subtask-to" className="assign-to input-group-field" type="text"/>
            <label>Assigned to</label>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="pickdate input-group-field" type="text"/>
            <label>Due date</label>
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
  form: 'addTaskForm'
})(AddTaskForm)

export default AddTaskForm;
