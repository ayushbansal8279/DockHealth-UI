import React, { Component} from 'react'
import Moment from 'react-moment'
import BaseComponent from '../BaseComponent'
import * as TaskListActions from '../../actions/tasklist-actions'
import MemberInitials from '../common/MemberInitials'
import MemberProfilePic from '../common/MemberProfilePic'
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
      this.props.findActivityFeedForAllTaskListsByUserId(0);
  }

    componentDidUpdate () {
      super.componentDidUpdate()
    }

  handleClick = (e, taskListId) => {
    e.preventDefault();
		toggleDropDown('activityList' + taskListId)
		alert('yes')
    //not working
    //$("#activityList").foundation('toggle', $(e.target));
    console.log('The accordion link was clicked.');
  };

	getUserProfilePic = () => {
		// alert("working")
	}

		// Lists Activity for a TaskList
    renderList(auditlist) {
       return auditlist.map((audit) =>{
          return(
						<div className="task-item row expanded condense align-middle" key={"audit" + audit.auditId}>
							<div className="columns shrink">
								{/* <MemberInitials /> */}
								{/* <img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/> */}
								<MemberInitials member={audit.user}/>
							</div>
							<div className="columns">
								<span className="task-title">{audit.activityFeed}</span>
							</div>
							<div className="columns shrink text-right more-options-wrapper">
								<span className="item-details"><Moment format="MMM DD">{audit.createdDateTime}</Moment></span>
							</div>
						</div>
          );
      })
    }

		// Lists TaskLists
    renderTaskListName(){
      return this.props.activityFeedForAllUserList.map((auditsandtasklist) =>{
        return(
					<li className="slim accordion-item" data-accordion-item key={"taskList" + auditsandtasklist.taskListId}>
						<a  href="#" className="accordion-title">{auditsandtasklist.listName}</a>
						{/* override of app.css line 2068 display:none : find in app-custonm .accordion-content line 122 */}
						<div className="accordion-content" data-tab-content>
              {this.renderList(auditsandtasklist.auditList) && this.renderList(auditsandtasklist.auditList).length > 0 ? this.renderList(auditsandtasklist.auditList) : <p className="light-gray">No Recent Activities</p>}
            </div>
          </li>
        );
      })
    }

    render (){
      return (
        <ul className="columns slim large-12 accordion" data-accordion data-allow-all-closed="true">
          {this.renderTaskListName()}
        </ul>
      )
    }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    activityFeedForAllUserList: state.taskListState.activityFeedForAllUserList
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListActivityFeedContainer);
