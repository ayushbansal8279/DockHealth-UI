import React from 'react';

import TaskListContainer from '../components/tasklist/TaskListContainer'
import Header from '../components/common/Header'

class TaskListView extends React.Component {
    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <Header title="Lists"/>

        <div className="add-form-wrapper">
          <div className="task-item add-form row expanded">
            <form className="inline-label">
              <div className="column large-12 text-center">
                <h5 className="section-title">Add a list</h5>
              </div>

              <div className="column large-12 input-group no-icon">
                <div className="form-floating-label input-wrapper">
                  <input className="input-group-field" type="text"/>
                  <label>List name</label>
                </div>
              </div>
							
							<div className="columns large-12 accordion" data-accordion data-allow-all-closed="true">
								<div className="accordion-item" data-accordion-item>
									<a href="#" className="accordion-title">Members</a>
									<div className="accordion-content" data-tab-content>
									<div className="columns input-group input-wrapper">
										<span className="input-group-label">
											<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
										</span>
										<div className="input-wrapper">
											<input id="add-member-to-list" className="assign-to input-group-field" type="text" placeholder="search for members"/>
										</div>
										</div>
									</div>
								</div>
							</div>

							<div className="column top-buffer large-12">
								<div className="row">
									<div className="column">
										<span className="item-title">Do not disturb</span>
										<p className="text-light">Fine print about notifications should go here</p>
									</div>
									<div className="column shrink">
										<div className="switch">
											<input className="switch-input" id="exampleSwitch" type="checkbox" name="exampleSwitch"/>
											<label className="switch-paddle" htmlFor="exampleSwitch">
												<span className="show-for-sr">Download Kittens</span>
											</label>
										</div>
									</div>
								</div>
							</div>

							<div className="column large-12 text-center top-buffer">
								<input type="submit" className="button secondary medium" value="Save"/>
							</div>

						</form>
					</div>
				</div>

				  <div className="list-wrapper">
					  <div className="item-list-wrapper">
              <div className="item row expanded align-middle">
                <div className="columns shrink">
                  <span className="circle xxsmall blue-bg"></span>
                </div>
                <div className="columns">
                  <h6 className="unread">Inbox</h6>
                </div>
                <div className="columns shrink">
                  <h6 className="unread">4</h6>
                </div>
                <div className="columns shrink">
                  <svg className="icon medium flag"><use xlinkHref="#icon-flag"></use></svg>	
                </div>
              </div>
              <div className="item row expanded align-middle">
                <div className="columns shrink">
                  <span className="circle xxsmall transparent"></span>
                </div>
                <div className="columns">
                  <h6>Important</h6>
                </div>
              </div>

            </div>

            <TaskListContainer/>     

					  <div className="item-list-wrapper">

              <div className="item row expanded align-middle">
                <div className="columns shrink">
                  <span className="circle xxsmall blue-bg"></span>
                </div>
                <div className="columns">
                  <h6 className="unread">Assigned to me</h6>
                </div>
                <div className="columns shrink">
                  <h6 className="unread">26</h6>
                </div>
                <div className="columns shrink">
                  <svg className="icon medium no-flag"><use xlinkHref="#icon-flag"></use></svg>	
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
                  <h6>Start Assigning</h6>
                </div>
                <div className="columns shrink">
                  <svg className="icon medium no-flag"><use xlinkHref="#icon-flag"></use></svg>	
                </div>
              </div>

            </div>
          </div>

          </div>
        </div> 
      </div> 

      );
  }
}

export default TaskListView;
