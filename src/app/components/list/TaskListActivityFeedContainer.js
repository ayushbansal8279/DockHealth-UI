import React, { Component} from 'react'
import Moment from 'react-moment'
import BaseComponent from '../BaseComponent'
import * as TaskListActions from '../../actions/tasklist-actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class TaskListActivityFeedContainer extends BaseComponent {

	constructor(props) {
	  	super(props)
	  	this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount () {
      super.componentDidMount()
      //queryStartPosition Zero is hardcoded because activity feed must alwqays return top 100 rows
      //for any more rows use findAuditsByTaskList must be used with proper queryStartPosition
      this.props.findAuditsForAllTaskListsByUserId(0);
  }

    componentDidUpdate () {
      super.componentDidUpdate()
    }

  handleClick = (e) => {
    // e.preventDefault();
    //not working
    //$("#activityList").foundation('toggle', $(e.target));
    console.log('The accordion link was clicked.');
  };

    renderList(auditlist) {
       return auditlist.map((audit) =>{
          return(
						<div className="task-item row expanded condense align-middle" key={"audit" + audit.auditId}>
							<div className="columns shrink">
								<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
							</div>
							<div className="columns">
								<span className="task-title">{audit.auditId + " " + audit.currentState}</span>
							</div>
							<div className="columns shrink text-right more-options-wrapper">
								<span className="item-details"><Moment format="MMM DD">{audit.createdDateTime}</Moment></span>
							</div>
						</div>
          );
      })
    }

    renderTaskListName(){
      return this.props.auditsForAllUserList.map((auditsandtasklist) =>{
        return(
					<div className="slim accordion-item" data-accordion-item key={"taskList" + auditsandtasklist.taskListId}>
						<a onClick={this.handleClick} href="#" className="accordion-title">{auditsandtasklist.listName}</a>
						{/* override of app.css line 2068 display:none : find in app-custonm .accordion-content line 122 */}
						<div className="accordion-content" data-tab-content>
              {this.renderList(auditsandtasklist.auditList)}
            </div>
          </div>
        );
      })
    }

    render (){
      return (
        <div className="columns slim large-12 accordion" data-accordion data-allow-all-closed="true">
          {this.renderTaskListName()}
        </div>
      )
    }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    auditsForAllUserList: state.taskListState.auditsForAllUserList
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListActivityFeedContainer);
