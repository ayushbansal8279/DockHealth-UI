import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import * as TaskListActions from '../../actions/tasklist-actions';
import {connect} from 'react-redux'
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';
import {bindActionCreators} from 'redux';

class TaskListInviteUsersContainer extends Component {

  constructor(props) {
    	super(props)
    	this.state = {
      		inviteUserResult: '',
          options: []
    	};
  	}

  componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.getOrganizationUsersNotInTaskList(this.props.taskListId);
    }

    onSubmit (formProps) {
      //alert(this.state.options);
        if(this.state.options.length ==0){
          alert("User must be selected before invitation is sent.");
        }
        else
        {
        this.props.inviteMultipleUsersToTaskList(this.props.taskListId,this.state.options)
        .then((res)=>{
          //this.props.resetForm;//reduxforms injected fucntion
          //hashHistory.push('/taskList')
          this.setState({inviteUserResult: 'Invitation sent successfully!!'}); //this will cause render to be called
        })
        .catch((error)=>{
          this.setState({inviteUserResult: error.message}); //this will cause render to be called
        })
      }
    }

    onChange(e) {
      // current array of options
      const options = this.state.options
      //alert(+e.target.value);
      if (e.target.checked) {
       // add the numerical value of the checkbox to options array
       options.push(e.target.value)
     } else {
       // or remove the value from the unchecked checkbox from the array
       const index = options.indexOf(e.target.value)
       options.splice(index, 1)
     }

     // update the state with the new array of options
     this.setState({ options: options })

    }

    createCheckboxes(){
      return this.props.orgusersnotintasklist.map((user) =>{
         return(
          <label key={user.userId} >
            <input type="checkbox" value={user.userId} onChange={this.onChange.bind(this)}/>
            <b>{user.firstName + "," + user.lastName}</b>
          </label>
         );
     })
    }

  //{...tasklistname} destructures the objects into key and values
  //and passes properties (like onchange, onBlur etc) into  <input> object title
  render (){
    const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return(
        <div className="content-block">

        <div className="row collapse my-form-container">
        <div className="large-12 columns" >
          <div className="column">
            <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
              <h4>List of user that can be invited to Task List: <strong>{this.props.taskListOne.listName}</strong></h4>

              <div className="row">
                <div className="small-12 columns">
                <h3>{this.state.inviteUserResult}</h3>
                </div>
              </div>

              <div>
                  {this.createCheckboxes()}
              </div>

              <div className="row">
                  <div className="medium-12 columns button-group">
                      <button className="button primary float-right button-small">Invite</button>
                    <Link to="/taskList"><button className="button secondary button-small float-right">Cancel</button></Link>
                  </div>
              </div>
            </form>
          </div>
        </div>
        </div>
        </div>
      );
    }
}

//this is automatically called as mentioned in last line reduxForm
function validate(values){
  const errors = {};

  return errors;
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    orgusersnotintasklist: state.taskListState.orgusersnotintasklist,
    taskListOne: state.taskListState.tasklistone
  };
}

// function mapDispatchToProps(dispatch) {
//   return  bindActionCreators(TaskListActions, dispatch)
// }

//this is almost similar to connect function from react-redux
//redux-form is injecting some helpers (like handleSubmit) that will be available to us on this.props
//this tells redux form about the fields that are contained within the form
//connect: 1st argument is mapStateToProps, 2nd is mapDispatchToProps
//redux form : 1st is form config, 2nd argument is mapStateToProps, 3rd is mapDispatchToProps

//redux form Version 6 specifically needs an call to connect
export default connect(mapStateToProps, TaskListActions)(reduxForm({
    form: 'TaskListAddForm',
    validate
})(TaskListInviteUsersContainer));
