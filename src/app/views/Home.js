import React from 'react'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'
import NotificationsToggle from '../components/tasklist/TaskListNotificationsToggle'

class Home extends React.Component {

  render() {
    var taskListId = this.props.params.taskListId
    return (
			<div className="off-canvas-content" data-off-canvas-content="true">
				<div className="row expanded collapse">
					<div className="large-12 columns">

						<header className="nav-down">
						<div className="top-bar">
							<div className="top-bar-left">
								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
			
								<h3>Boston Clinic</h3> <span className="number-of-tasks hide">23 Tasks</span>
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
								<div className="columns shrink">
									<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
								</div>	
			
							</div>
							</header>
			        
              <div className="add-form-wrapper">
								<div className="task-item add-form row expanded">
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
			
											<div className="column large-12 input-group">
												<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
												<div className="input-wrapper form-floating-label">
													<input className="pickdate input-group-field" type="text"/>
													<label>Due date</label>
												</div>
											</div>
			
											<div className="column large-12 input-group toggle-add-subtask has-value">
												<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
												<div className="input-wrapper form-floating-label">
													<input className="input-group-field" type="text" value="This is a subtask that has been added"/>
													<label>Subtask #1</label>
												</div>
											</div>
			
											<div className="column large-12 input-group toggle-add-subtask has-value">
												<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
												<div className="input-wrapper form-floating-label">
													<input className="input-group-field" type="text" value="This is a second subtask."/>
													<label>Subtask #2</label>
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
			
											<div className="column large-12 input-group has-value">
												<span className="task-title">Task: Please help get Sally in for early Remicade infusion</span>
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
												<input type="submit" className="button secondary" value="Save"/>
											</div>
										</div>
			
									</form>
								</div>
							</div>

              <div className="list-wrapper">
                <div className="task-item-wrapper">
                  <div className="new-task text-center"><span className="number-new-tasks">1 new task</span></div>
                      <ListOfTasksContainer taskListId={taskListId} status="INCOMPLETE"/>
                      <div className="show-completed text-center">
                        <a className="toggle-completed button primary small">Show completed tasks</a>
                      </div>
                      <ListOfTasksContainer taskListId={taskListId} status="COMPLETE"/>
                  </div> 
                </div> 
              </div>

						</div> 
					</div> 

    );
  }
}

export default Home
