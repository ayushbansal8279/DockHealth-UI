import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import BaseComponent from '../BaseComponent'

class AddSubtaskField extends BaseComponent{

  render(){
    return(
      <div onClick={(e) => this.props.setCurrentSubtask(this.props.subtask, this.props.index)}  className="column large-12 input-group toggle-add-subtask has-value">
        <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
        <div className="input-wrapper form-floating-label">
          <input className="input-group-field" type="text" value={this.props.subtask.description}/>
          <label>Subtask #{this.props.index + 1}</label>
        </div>
      </div>
    )
  }
}

AddSubtaskField = reduxForm({
  // a unique name for the form
  form: 'addSubtaskField',
  enableReinitialize : true
})(AddSubtaskField)

const mapStateToProps = function(store){

  // var initialValues = {}
  // if(this.props.taskList){
  //   initialValues = this.props.taskList
  // }
  // return{
  //   initialValues: initialValues
  // }
}

export default connect(mapStateToProps)(AddSubtaskField)
