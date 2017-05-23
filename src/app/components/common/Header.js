import React from 'react'
import AddTask from '../task/AddTask'
import PropTypes from 'prop-types'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'

class Header extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        value: '',
        title: props.taskList.listName
      }
      this.getTasksAssignedByMe = this.getTasksAssignedByMe.bind(this)
      this.changeTitle = this.changeTitle.bind(this)
      this.getInboxTasks = this.getInboxTasks.bind(this)
      this.getListTasks = this.getListTasks.bind(this)
    }

    componentDidMount () {
      this.props.taskListActions.getTaskListForUser();
    }

    getTasksAssignedByMe(){
      this.props.taskActions.getTasksAssignedByMe()
    }

    getInboxTasks(){
      this.props.taskActions.getInboxTasks()
    }

    getListTasks(taskListId){
      this.props.taskActions.getListTasksByUser(taskListId)
    }

    changeTitle(newTitle){
      // alert("working")
      this.setState({title: newTitle})
    }

    componentDidMount(){
      this.props.taskListActions.getTaskListForUser()
    }

    componentWillMount() {
      this.props.taskListActions.getTaskListById('1')
      this.setState({title: "Inbox"})
    }

    getListTasks(taskListId){
      this.props.taskActions.getListTasks(taskListId)
    }


    render() {
    return (

      <div id="header-start">
          <div data-sticky-container>
      	<div className="sticky" data-top-anchor="header-start" data-sticky data-margin-top="0">
      		<header>
      		<div className="row">
      			<div className="large-12 columns">
      				<ul id="mainmenu" className="menu dropdown" data-dropdown-menu data-disable-hover="true" data-click-open="true">
      				<li className="my-menu">
      				<span className="logo default"><span className="logo-text">BC</span></span>
      				<h2>{this.state.title} <svg className="icon"><use xlinkHref="#icon-angle-down"></use></svg></h2>
      				<ul className="menu title-dropdown-menu">
      					<li className="search"><svg className="icon"><use xlinkHref="#icon-search"></use></svg>Search</li>
      					<li onClick={(e) => {this.alert; this.changeTitle("Today")}}><svg className="icon green large"><use xlinkHref="#icon-calendar"></use></svg>Today</li>
      					<Link to={"/inbox/"}><li onClick={(e) => {this.getInboxTasks(); this.changeTitle("Inbox")}}><svg className="icon blue large"><use xlinkHref="#icon-envelope"></use></svg>Inbox</li></Link>
      					<li><img className="memberphoto active" src="assets/img/memberphoto.png" alt="name of user"/>Assigned to me</li>
      					<li onClick={(e) => {this.getTasksAssignedByMe(); this.changeTitle("Assigned By Me")}}><svg className="icon blue large"><use xlinkHref="#icon-forward"></use></svg>Assigned by me</li>
      				  <li><svg className="icon large priority high"><use xlinkHref="#icon-cross"></use></svg>Important</li>
                {this.props.taskLists.map(taskList => {
                  return(

                    <li key={taskList.taskListId} onClick={(e) => {this.changeTitle(taskList.listName); this.getListTasks(taskList.taskListId)}}><span className="list-logo small"><span className="logo-text small">BC</span></span>{taskList.listName}</li>
                  )
                })}
      				</ul>
      			    </li>
      			    </ul>
      			</div>
      		</div>
      		<div className="row">
      			<div className="large-8 columns my-task-add-button">
      				<svg className="add icon primary xlarge"><use href="#icon-add-large"></use></svg>
      		    </div>
      	    </div>
      	    </header>

      	<AddTask/>

          <div className="dropdown-pane" id="set-date" data-dropdown data-close-on-click="true">
              <label>Set due date <input type="text" className="due-date" placeholder="due date"/></label>
              <label>Schedule reminder <input type="text" className="reminder" placeholder="reminder"/></label>
          </div>

          </div>
          </div>
      </div>
      );
    }
}

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    taskList: store.taskListState.tasklistone, // tasklistone is set at the reducer
    taskLists: store.taskListState.tasklist
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
