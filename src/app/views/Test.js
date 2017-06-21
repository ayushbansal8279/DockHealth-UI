import React from 'react';
import $ from 'jquery'
{/* use to test html and clean up before implementing into components */}

import TaskListContainer from '../components/tasklist/TaskListContainer'
import Header from '../components/common/Header'

class Test extends React.Component {
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

        			<div className="add-form-wrapper">
        				<div className="task-item add-form row expanded">
        					<form className="inline-label">
        						<div className="column large-12 text-center">
        							<h5 className="section-title">Add a list</h5>
        						</div>

        						{/* <!-- List name --> */}
        						<div className="column large-12 input-group no-icon">
        							<div className="form-floating-label input-wrapper">
        								<input className="input-group-field" type="text"/>
        								<label>List name</label>
        							</div>
        						</div>

        						{/* <!-- Owner --> */}
        						<div className="column large-12 input-group no-icon static-label">
        							<div className="input-wrapper">
        								<label>Owner</label>
        								<img className="member-photo circle medium float-right" src="assets/img/user1.png" alt="name of user"/>
        							</div>
        						</div>

        						{/* <!-- Admins --> */}
        						<div className="column large-12 input-group no-icon static-label">
        							<div className="input-wrapper">
        								<label>Admins</label>
        								<ul className="menu member-photo-list">
        									<li><span className="add-member circle medium">+</span></li>
        									<li><span className="more-members circle medium">+4</span></li>
        									<li><img className="member-photo circle medium" src="assets/img/user1.png" alt="name of user"/></li>
        									<li><img className="member-photo circle medium" src="assets/img/user2.png" alt="name of user"/></li>
        									<li><span className="member-initials circle medium">SL</span></li>
        									<li><img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/></li>
        								</ul>
        							</div>
        						</div>

        						{/* <!--Members --> */}
        						<div className="column large-12 input-group no-icon static-label accordion" data-accordion data-allow-all-closed="true">
        							<div className="input-wrapper accordion-item" data-accordion-item>
        								<a href="#" className="accordion-title">
        									<label>Members</label>
        									<ul className="menu member-photo-list">
        										<li><span className="add-member circle medium">+</span></li>
        									</ul>
        								</a>
        								<div className="accordion-content" data-tab-content>
        										<div className="row collapse expanded align-middle">
        											<div className="columns input-group input-wrapper search-group">
        												<span className="input-group-label">
        													<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
        												</span>
        												<div className="input-wrapper">
        													<input id="add-member-to-list" className="input-group-field" type="text"/>
        												</div>
        											</div>
        										</div>
        									<div className="scroll-wrapper">
        										<div className="row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/>
        											</div>
        											<div className="columns">
        												<span className="item-content">Megan Smith</span>
        											</div>
        										</div>
        										<div className="row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<img className="member-photo circle medium" src="assets/img/user2.png" alt="name of user"/>
        											</div>
        											<div className="columns">
        												<span className="item-content">Jenny Davis</span>
        											</div>
        										</div>
        										<div className="row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<img className="member-photo circle medium" src="assets/img/user1.png" alt="name of user"/>
        											</div>
        											<div className="columns">
        												<span className="item-content">Christopher Richardson</span>
        											</div>
        										</div>
        										<div className="selected row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<span className="member-initials circle medium">SL</span>
        											</div>
        											<div className="columns">
        												<span className="item-content">Samuel Lowe</span>
        											</div>
        										</div>
        										<div className="row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<span className="member-initials circle medium">JO</span>
        											</div>
        											<div className="columns">
        												<span className="item-content">Jack Oliver</span>
        											</div>
        										</div>
        										<div className="row condense expanded border-bottom align-middle">
        											<div className="columns shrink">
        												<span className="member-initials circle medium">PG</span>
        											</div>
        											<div className="columns">
        												<span className="item-content">Peter Gonzales</span>
        											</div>
        										</div>
        									</div>{/* <!--wrapper--> */}


        								</div>
        							</div>
        						</div>


        						{/* <!-- Do not disturb --> */}
        						<div className="column top-buffer large-12">
        							<div className="row collapse">
        								<div className="column">
        									<span className="item-content">Do not disturb</span>
        									<span className="details">Fine print about notifications should go here</span>
        								</div>
        								<div className="column shrink">
        									<div className="switch">
        										<input className="switch-input" id="exampleSwitch" type="checkbox" name="exampleSwitch"/>
        										<label className="switch-paddle" htmlFor="exampleSwitch">
        											<span className="show-for-sr"></span>
        										</label>
        									</div>
        								</div>
        							</div>
        						</div>

        						{/* <!-- SAVE --> */}
        						<div className="column large-12 text-center top-buffer">
        							<input type="submit" className="button secondary medium" value="Save"/>
        						</div>

        					</form>
        				</div>
        			</div>{/* <!--add-form-wrapper--> */}

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

export default Test;
