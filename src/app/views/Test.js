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

						<div className="wrapper list-filter row collapse align-middle align-right">
							<div className="columns shrink controls">
								<button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
								<div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true">
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

						</div>{/*list-filter*/}
						</header>{/*slideUp*/}

						<div className="add-form-wrapper">
							<div className="task-item add-form row expanded">
								<form className="inline-label">
									<div className="main-task-wrapper">
										<div className="column large-12 text-center">
											<h5 className="section-title">Add a Task</h5>
										</div>

										{/* Task */}
										<div className="column large-12 input-group icon-right icon-left">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="input-group-field" type="text"/>
												<label>Task</label>
											</div>
											<span className="input-group-label"><svg className="icon flag no-flag medium"><use xlinkHref="#icon-flag"></use></svg></span>
										</div>

										{/* ADD PATIENT */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-patient"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input id="add-patient" className="add-patient input-group-field" type="text"/>
												<label>Add Patient</label>
											</div>
										</div>

										{/* FILE IN */}
										<div className="column large-12 input-group input-dropdown">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-list"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="input-group-field" type="text" data-toggle="add-task-file-in-options"/>
												<label>File in</label>
											</div>

											<div className="dropdown-pane" id="add-task-file-in-options" data-dropdown data-close-on-click="true">
												<fieldset className="large-12 columns">
													<input id="checkbox1" type="checkbox"/><label for="checkbox1">Inbox</label><br/>
													<input id="checkbox2" type="checkbox"/><label for="checkbox2">Boston Clinic (Mike Docktor)</label><br/>
													<input id="checkbox3" type="checkbox"/><label for="checkbox3">Waltham Clinic (Mike Docktor)</label>
												</fieldset>
											</div>
										</div>

										{/* ASSIGNED TO */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input id="assign-task-to" className="assign-to input-group-field" type="text"/>
												<label>Assigned to</label>
											</div>
										</div>

										{/* DUE DATE */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="pickdate input-group-field" type="text"/>
												<label>Due date</label>
											</div>
										</div>

										{/* SUBTASKS */}
										<div className="column large-12 input-group toggle-add-subtask has-value">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="input-group-field" type="text" value="This is a subtask that has been added"/>
												<label>Subtask #1</label>
											</div>
										</div>

										{/* SUBTASKS */}
										<div className="column large-12 input-group toggle-add-subtask has-value">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="input-group-field" type="text" value="This is a second subtask."/>
												<label>Subtask #2</label>
											</div>
										</div>

										<div className="row expanded">
											<div className="columns highlight center-content-vertical toggle-add-subtask link">
												<svg className="icon hide"><use xlinkHref="#icon-subtask"></use></svg>+ Add a subtask
											</div>

											{/* SAVE */}
											<div className="columns shrink align-right">
												<input type="submit" className="button secondary medium" value="Save"/>
											</div>
										</div>
									</div>{/*main-task-wrapper*/}

									<div className="subtask-wrapper">
										<div className="row expanded">
											<div className="column small-4 toggle-add-subtask">
												<svg className="icon"><use xlinkHref="#icon-arrow-left"></use></svg>
											</div>
											<div className="column small-4 text-center">
												<h5 className="section-title">Add a subtask</h5>
											</div>
										</div>

										{/* Main task title */}
										<div className="column large-12 input-group has-value">
											<span className="task-title">Task: Please help get Sally in for early Remicade infusion</span>
										</div>

										{/* Task */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="input-group-field" type="text"/>
												<label>Subtask</label>
											</div>
										</div>

										{/* ADD PATIENT */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input id="add-patient-subtask" className="add-patient input-group-field" type="text"/>
												<label>Add Patient</label>
											</div>
										</div>

										{/* ASSIGNED TO */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input id="assign-subtask-to" className="assign-to input-group-field" type="text"/>
												<label>Assigned to</label>
											</div>
										</div>

										{/* DUE DATE */}
										<div className="column large-12 input-group">
											<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
											<div className="input-wrapper form-floating-label">
												<input className="pickdate input-group-field" type="text"/>
												<label>Due date</label>
											</div>
										</div>

										{/* SAVE */}
										<div className="column large-12 text-right">
											<input type="submit" className="button secondary" value="Save"/>
										</div>
									</div>{/*subtask-wrapper*/}

								</form>
							</div>
						</div>{/*add-form-wrapper*/}
						<div className="list-wrapper">
							<div className="task-item-wrapper">
								<div className="task-item row expanded">
										<div className="columns shrink">
											<div className="mark-complete"></div>
										</div>
										<div className="columns shrink">
											<img className="member-photo circle" data-open="edit-assign-to" src="assets/img/user1.png" alt="name of user"/>
										</div>
										<div className="columns shrink align-right">
											<svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg>
										</div>
										<div className="columns">
											<span className="task-title" data-editable>Schedule scope for Sally</span>
											<input className="task-title" type="text"/>
											<span className="task-patient text-em">Mae, Sally 276-34-90</span>
											<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
											<div className="comments-container">
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink">
														<img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/>
													</div>
													<div className="columns" add-comment>
														<span className="comment-button comment text-light">Add a comment...</span>
														<textarea className="add-comment comment"></textarea>
														<button className="save-comment button primary xsmall">Post</button>
													</div>
												</div>
											</div>{/*comments-container*/}
										</div>
										<div className="columns shrink more-options-wrapper">
											<svg className="icon ellipses medium" data-toggle="more-options-task-id-01"><use xlinkHref="#icon-ellipses"></use></svg>
											<div className="small dropdown-pane" id="more-options-task-id-01" data-dropdown data-close-on-click="true">
												<ul className="no-bullet">
													<li>Mark as unread</li>
													<li className="edit-task">Edit task</li>
													<li>Add subtask</li>
													<li>Delete task</li>
												</ul>
											</div>
										</div>
								</div>{/* task-item */}


								<div className="task-item has-subtasks">
										<div className="main-task-item row expanded">
											<div className="columns shrink">
												<div className="mark-complete"></div>
											</div>
											<div className="columns shrink">
												<span className="unseen">
													<img className="member-photo circle" src="assets/img/user3.png" alt="name of user"/>
												</span>
											</div>
											<div className="columns shrink align-right">
												<svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg>
											</div>
											<div className="columns">
												<span className="task-title" data-editable>Schedule scope for Sally</span>
												<input className="task-title" type="text"/>
												<span className="task-patient text-em">Mae, Sally 276-34-90</span>
												<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
											</div>
											<div className="columns shrink more-options-wrapper">
												<svg className="icon ellipses medium" data-toggle="more-options-task-id-02"><use xlinkHref="#icon-ellipses"></use></svg>
												<div className="small dropdown-pane" id="more-options-task-id-02" data-dropdown data-close-on-click="true">
													<ul className="no-bullet">
														<li>Mark as unread</li>
														<li>Edit task</li>
														<li>Add subtask</li>
														<li>Delete task</li>
													</ul>
												</div>
											</div>
										</div>

										<div className="subtask-item row expanded">
											<div className="columns shrink">
												<div className="mark-complete"></div>
											</div>
											<div className="columns shrink">
												<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
											</div>
											<div className="columns shrink align-right">
												<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
											</div>
											<div className="columns">
												<span className="task-title"><span className="subtask-number">1.</span>John, can you check on Sally's insurance to make sure this will be covered?</span>
												<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
											</div>
											<div className="columns shrink more-options-wrapper">
												<svg className="icon ellipses medium" data-toggle="more-options-task-id-03"><use xlinkHref="#icon-ellipses"></use></svg>
												<div className="small dropdown-pane" id="more-options-task-id-03" data-dropdown data-close-on-click="true">
													<ul className="no-bullet">
														<li>Mark as unread</li>
														<li>Edit task</li>
														<li>Add subtask</li>
														<li>Delete task</li>
													</ul>
												</div>
											</div>
										</div>

										<div className="subtask-item row expanded">
											<div className="columns shrink">
												<div className="mark-complete"></div>
											</div>
											<div className="columns shrink">
												<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
											</div>
											<div className="columns shrink align-right">
												<svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg>
											</div>
											<div className="columns">
												<span className="task-title unread"><span className="subtask-number">2.</span>Bill the correct code for this</span>
												<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
											</div>
										</div>

										<div className="subtask-item row expanded">
											<div className="columns shrink">
												<div className="mark-complete complete"><svg className="small icon"><use xlinkHref="#icon-checkmark"></use></svg></div>
											</div>
											<div className="columns shrink">
												<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
											</div>
											<div className="columns shrink align-right">
												<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
											</div>
											<div className="columns">
												<span className="task-title complete"><span className="subtask-number">3.</span>Schedule a call with patient's primary physician.</span>
												<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
												<div className="comments-container">
													<div className="row expanded collapse comment-wrapper">
														<div className="columns shrink">
															<span className="member-initials circle xsmall">MD</span>
														</div>
														<div className="columns">
															<span className="comment">Ok, I'll make sure</span>
														</div>
														<div className="columns shrink align-right">
															<span className="time comment-time">1m ago</span>
														</div>
													</div>
													<div className="row expanded collapse comment-wrapper">
														<div className="columns shrink">
															<span className="member-initials circle xsmall">SL</span>
														</div>
														<div className="columns">
															<span className="comment">Yes, it's covered. Noted her MR.</span>
														</div>
														<div className="columns shrink align-right">
															<span className="time comment-time">10m ago</span>
														</div>
													</div>
												</div>{/*comments-container*/}
											</div>
										</div>
									</div>{/* task-item */}

									<div className="task-item row expanded">
										<div className="columns shrink">
											<div className="mark-complete"></div>
										</div>
										<div className="columns shrink">
											<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
										</div>
										<div className="columns shrink align-right">
											<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
										</div>
										<div className="columns">
											<span className="task-title">Call back mom of Sally re: celiac results 617-355-1234</span>
											<span className="task-patient text-em">Mae, Sally 276-34-90</span>
											<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
										</div>
								</div>{/* task-item */}
								<div className="task-item row expanded">
										<div className="columns shrink">
											<div className="mark-complete"></div>
										</div>
										<div className="columns shrink">
											<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
										</div>
										<div className="columns shrink align-right">
											<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
										</div>
										<div className="columns">
											<span className="task-title">Call back mom of Sally re: celiac results 617-355-1234</span>
											<span className="task-patient text-em">Mae, Sally 276-34-90</span>
											<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>

											<div className="row collapse email-wrapper">
												<div className="columns shrink">
													<svg className="icon"><use xlinkHref="#icon-email"></use></svg>
												</div>
												<div className="columns">
													<div className="email-container">
														<p>Hi Mike,</p>
														<p>When television was young, there was a hugely popular show based on the still popular fictional character of Superman. The opening of that show had a familiar phrase that went, “Look. Up in the sky. It’s a bird. It’s a plane. It’s Superman!” How beloved Superman has become in our culture and the worldwide fascination with extraterrestrials and all things cosmic only emphasizes that there is a deep curiosity in all humans about nature and astronomy, even if many people would not know to call it astronomy.</p>
														<p>Astronomy is one of the oldest sciences of all time. When archeologists unearth ancient civilizations, even as far back as the cavemen, they invariably find art that shows mans unquenchable fascination with the stars. To this day, you can easily get an animated discussion at any gathering on the topic of “Is there intelligent life on other planets?”</p>
														<span className="expand-content circle xsmall"><svg className="icon"><use xlinkHref="#icon-slim"></use></svg></span>
													</div>{/*email-container*/}
												</div>
											</div>
										</div>
								</div>{/* task-item */}
								<div className="task-item row expanded">
									<div className="columns shrink">
										<div className="mark-complete"></div>
									</div>
									<div className="columns shrink">
										<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
									</div>
									<div className="columns shrink align-right">
										<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
									</div>
									<div className="columns">
										<span className="task-title">Call back mom of Sally re: celiac results 617-355-1234</span>
										<span className="task-patient text-em">Mae, Sally 276-34-90</span>
										<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>

										<div className="row collapse email-wrapper">
											<div className="columns shrink">
												<svg className="icon"><use xlinkHref="#icon-email"></use></svg>
											</div>
											<div className="columns">
												<div className="email-container">
													<p>Hi Mike,</p>
													<p>When television was young, there was a hugely popular show based on the still popular fictional character of Superman. The opening of that show had a familiar phrase that went, “Look. Up in the sky. It’s a bird. It’s a plane. It’s Superman!” How beloved Superman has become in our culture and the worldwide fascination with extraterrestrials and all things cosmic only emphasizes that there is a deep curiosity in all humans about nature and astronomy, even if many people would not know to call it astronomy.</p>
													<p>Astronomy is one of the oldest sciences of all time. When archeologists unearth ancient civilizations, even as far back as the cavemen, they invariably find art that shows mans unquenchable fascination with the stars. To this day, you can easily get an animated discussion at any gathering on the topic of “Is there intelligent life on other planets?”</p>
													<span className="expand-content circle xsmall"><svg className="icon"><use xlinkHref="#icon-slim"></use></svg></span>
												</div>{/*email-container*/}
											</div>
										</div>{/*email-wrapper*/}

										<div className="comments-container">
											<div className="row expanded collapse comment-wrapper">
												<div className="columns shrink">
													<span className="member-initials circle xsmall">MD</span>
												</div>
												<div className="columns">
													<span className="comment">Ok, I'll make sure</span>
												</div>
												<div className="columns shrink align-right">
													<span className="time comment-time">1m ago</span>
												</div>
											</div>
											<div className="row expanded collapse comment-wrapper">
												<div className="columns shrink">
													<span className="member-initials circle xsmall">SL</span>
												</div>
												<div className="columns">
													<span className="comment">Yes, it's covered. Noted her MR.</span>
												</div>
												<div className="columns shrink align-right">
													<span className="time comment-time">10m ago</span>
												</div>
											</div>
										</div>{/*comments-container*/}
									</div>
								</div>{/* task-item */}
								<div className="task-item">
									<div className="row expanded">
										<div className="columns shrink">
											<div className="mark-complete"></div>
										</div>
										<div className="columns shrink">
											<img className="member-photo circle" src="assets/img/user2.png" alt="name of user"/>
										</div>
										<div className="columns shrink align-right">
											<svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg>
										</div>
										<div className="columns">
											<span className="task-title">Please help get Stephanie in for early Remicade infusion, not feeling well.</span>
											<span className="task-patient text-em">Jones, Stephanie 346-44-91</span>
											<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
											<div className="comments-container">
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink">
														<span className="member-initials circle xsmall">MD</span>
													</div>
													<div className="columns">
														<span className="comment">Ok, I'll make sure</span>
													</div>
													<div className="columns shrink align-right">
														<span className="time comment-time">1m ago</span>
													</div>
												</div>
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink">
														<span className="member-initials circle xsmall">SL</span>
													</div>
													<div className="columns">
														<span className="comment">Yes, it's covered. Noted her MR.</span>
													</div>
													<div className="columns shrink align-right">
														<span className="time comment-time">1m ago</span>
													</div>
												</div>
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink">
														<img className="member-photo circle xsmall" src="assets/img/user2.png" alt="name of user"/>
													</div>
													<div className="columns">
														<span className="comment">We need to make sure it's categorized correctly</span>
													</div>
													<div className="columns shrink align-right">
														<span className="time comment-time">1m ago</span>
													</div>
												</div>
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink">
														<span className="member-initials circle xsmall">MD</span>
													</div>
													<div className="columns">
														<span className="comment">Sounds good. Will do.</span>
													</div>
													<div className="columns shrink align-right">
														<span className="time comment-time">1m ago</span>
													</div>
												</div>
												<div className="row expanded collapse comment-wrapper">
													<div className="columns shrink text-light">
														Load 2 earlier comments
													</div>
												</div>
											</div>{/*comments-container*/}
										</div>
									</div>
								</div>{/* task-item */}
							</div>{/* task-item-wrapper*/}
							<div className="show-completed text-center">
								<a className="toggle-completed button primary small">Show completed tasks</a>
							</div>


							<div className="completed-task-wrapper">
								<div className="task-item row expanded">
									<div className="columns shrink">
										<div className="mark-complete complete"><svg className="small icon"><use xlinkHref="#icon-checkmark"></use></svg></div>
									</div>
									<div className="columns shrink">
										<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
									</div>
									<div className="columns">
										<span className="task-title complete">Call back mom of Sally re: celiac results 617-355-1234</span>
										<span className="task-patient text-em">Mae, Sally 276-34-90</span>
										<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
									</div>
									<div className="columns shrink align-right">
										<svg className="icon medium flag no-flag"><use xlinkHref="#icon-flag"></use></svg>
									</div>
								</div>{/* task-item */}
							</div>{/*completed-task-wrapper*/}
						</div>

					</div>
				</div>
			</div>
      );
  }
}

export default Test;
