import React, { Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import { Link,hashHistory } from 'react-router';
import {connect} from 'react-redux'
import BasicField from '../common/BasicField';
import {updateTaskList} from '../../actions/tasklist-actions';
import {mobileAnalyticsClient} from '../../api/analytics-api'

class TaskListOneRenderContainer extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
      		addtasklisterror: ''
    	};
  }

  componentDidMount () {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
            'PageName': 'TaskListEditName'
      });
    }

  onSubmit (formProps) {
    //console.log(formProps);
    this.props.updateTaskList(formProps,this.props.currentList.taskListId)
    .then((res)=>{
      //this.props.resetForm;//reduxforms injected fucntion
      hashHistory.push('/taskList')
    })
    .catch((error)=>{
      this.setState({addtasklisterror: error.message}); //this will cause render to be called
    })

  }
  render(){
    const handleSubmit = this.props.handleSubmit; //injected by reduxform

    return(
      <div>
        <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>

        <div className="row">
          <div className="small-12 columns">
          <h3>{this.state.addtasklisterror}</h3>
          </div>
        </div>


        <div className="row">
          <div className="small-12 columns">
          <h3>Update a Task List</h3>
          </div>
        </div>


        <div className="row">
          <div className="small-10 columns">
             Existing TaskList Name: <strong>{this.props.currentList.listName}</strong>
          </div>
        </div>

        <div className="row">
          <div className="small-4 columns">
             <Field name="tasklistname" type="text" component={BasicField} label='New Task List Name'/>
          </div>
        </div>


        <div className="row">
            <div className="small-12 columns button-group">
                <button className="button primary float-left button-small">Save</button>
                <Link to="/taskList"><button className="button secondary button-small float-left">Cancel</button></Link>
            </div>
        </div>

      </form>
      </div>
    );
  }

}

function validate(values){
  const errors = {};

  if(!values.tasklistname){
    errors.tasklistname = 'Please enter a new name for task list';
  }
  return errors;
}

export default connect(null, {updateTaskList})(reduxForm({
    form: 'TaskListUpdateForm',
    validate
})(TaskListOneRenderContainer));
