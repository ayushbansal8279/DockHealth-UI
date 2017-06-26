import React from 'react'
import AddTask from '../task/AddTask'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as PatientActions from '../../actions/patient-actions'
import {ReactDOM, findDOMNode} from 'react-dom'
import $ from 'jquery'

class HeaderTasks extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: '',
      hideForm: true
    }
  }

  componentDidMount () {
    this.props.taskListActions.getTaskListForUser()
    this.props.patientActions.getAllPatients()
  }

  getListTasks(taskListId){
    this.props.taskActions.getListTasks(taskListId)
  }

	handleAddTask = () => {
		this.props.taskActions.taskToState(null)
	};

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }

    render() {
    return (
      <div>
        <header className="nav-down">
						<div className="top-bar">
							<div className="top-bar-left">
								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>

								<h3>{this.props.title}</h3> <span className="number-of-tasks hide">23 Tasks</span>
							</div>
							<div className="top-bar-right">
								<ul className="menu member-photo-list" data-open="list-members">
									<li><span className="add-member circle small">+</span></li>
									<li><span className="more-members circle small">+4</span></li>
									<li><img className="member-photo circle small" src="assets/img/user1.png" alt="name of user"/></li>
									<li><img className="member-photo circle small" src="assets/img/user2.png" alt="name of user"/></li>
									<li><span className="member-initials circle small">SL</span></li>
									<li><img className="member-photo circle small" src="assets/img/user3.png" alt="name of user"/></li>
			          </ul>
								</div>
							</div>

              {/*<TaskFiltersContainer taskListId={taskListId} />*/}

							<div className="wrapper list-filter row expanded collapse align-middle align-right">
								<div className="columns shrink controls">
									<button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
									<div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
										<ul className="no-bullet">
											<li>Due date</li>
											<li className="active">Creation date</li>
											<li>Patient</li>
											<li>Assignee</li>
											<li>Assigned to</li>
											<li>Priority</li>
											<li>Tag</li>
										</ul>
									</div>
								</div>

								<div className="columns controls">
									<div className="input-group searchbar">
										<input className="input-field search-field" type="search" placeholder="Search tasks" />
										<div className="input-group-button">
											<button className="button search">
												<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
											</button>
										</div>
									</div>
								</div>

								<div className="columns shrink icon-group controls">
									<svg className="icon"><use xlinkHref="#icon-bell"></use></svg>
									<svg className="icon"><use xlinkHref="#icon-print"></use></svg>
									<svg className="icon toggle-slim"><use xlinkHref="#icon-slim"></use></svg>
								</div>

								<div className="columns shrink" onClick={(e) => this.handleAddTask()}>
									<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
								</div>

						</div>
        </header>

        <AddTask taskListId={this.props.taskListId} addTask={this.props.taskActions.addTask} taskLists={this.props.taskList} patients={this.props.patients}/>
      </div>
      );
    }
}

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    taskList: store.taskListState.tasklistone, // tasklistone is set at the reducer
    taskLists: store.taskListState.tasklist,
    patients: store.patientState.allPatients
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTasks)
