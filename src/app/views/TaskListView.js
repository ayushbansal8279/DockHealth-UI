import React from 'react';
import AddTaskForm from '../components/list/AddListForm'
import TaskListContainer from '../components/tasklist/TaskListContainer'
import Header from '../components/common/Header'

class TaskListView extends React.Component {
    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content>
        	<div className="row expanded collapse">
        		<div className="large-12 columns">

        			<header className="nav-down">
        			<div className="top-bar">
        				<div className="top-bar-left">
        					<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
        					<h3>Lists</h3>
        				</div>
        			</div>

        			<div className="wrapper list-filter row expanded collapse align-middle align-right">
        				<div className="columns controls">
        					{/* {{> search}} */}
        				</div>
        				<div className="columns shrink">
        					<svg id="icon-lists" className="add add-other icon"><use xlinkHref="#icon-lists"></use></svg>
        				</div>

        			</div>{/* <!--list-filter--> */}
        			</header>{/* <!--slideUp--> */}

              <AddTaskForm/>

        			<div className="list-wrapper">
        				<div className="item-list-wrapper">
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<a href="index.html"><h6>Boston Clinic</h6></a>
        							<span className="details">Mike Docktor</span>
        							<span className="item-details highlight">Pending</span>

        						</div>
        						<div className="columns shrink">
        							<button className="button primary small split">
        								<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Accept invitation" className="button-left"><svg className="icon"><use xlinkHref="#icon-checkmark"></use></svg> Accept</span>
        								<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="Decline invitation" className="button-right cancel-button"><svg className="icon"><use xlinkHref="#icon-close"></use></svg> Decline</span>
        							</button>
        						</div>
        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall blue-bg" data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="2 new tasks"></span>
        						</div>
        						<div className="columns">
        							<a href=""><h6 className="">Waltham Clinic</h6></a>
        							<span className="details">Christopher Richardson</span>
        						</div>
        						<div className="columns shrink">
        							<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="3 high priority tasks"><svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg></span>
        						</div>
        						<div className="columns shrink align-right">
        							<h6 className="">12</h6>
        						</div>
        						<div className="columns shrink more-options-wrapper">
        							<svg className="icon ellipses medium" data-toggle="more-options-task-id-01"><use xlinkHref="#icon-ellipses"></use></svg>
        							<div className="small dropdown-pane" id="more-options-task-id-01" data-dropdown data-close-on-click="true">
        								<ul className="no-bullet">
        									<li>Delete list</li>
        									<li>Change name</li>
        									<li>Leave list</li>
        								</ul>
        							</div>
        						</div>

        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall blue-bg" data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="2 new tasks"></span>
        						</div>
        						<div className="columns">
        							<h6 className="">Waltham Clinic</h6>
        							<span className="details">Mike Docktor</span>
        						</div>
        						<div className="columns shrink align-right">
        							<h6 className="">9</h6>
        						</div>
        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6 className="">Inbox</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">4</h6>
        						</div>
        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6>Important</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">0</h6>
        						</div>
        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6 className="">Assigned to me</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">26</h6>
        						</div>
        					</div>
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6>Assigned by me</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">0</h6>
        						</div>
        					</div>
        				</div>{/* <!--item-list-wrapper--> */}
        			</div>{/* <!--list-wrapper--> */}
        		</div>
        	</div>
        </div>

      );
  }
}

export default TaskListView;
