import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskListActions from 'actions/task-list-actions';

class TaskListActivityFeedContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { findActivityFeedForAllTaskListsByUserId } = this.props;

    findActivityFeedForAllTaskListsByUserId(0);
  }

  handleClick = (event) => {
    event.preventDefault();
  };

  renderList = (auditlist) =>
    auditlist?.map((audit) => {
      return (
        <div
          className="task-item row expanded condense align-middle"
          key={`audit${audit.auditId}`}
        >
          <div className="columns">
            <span className="task-title">{audit.activityFeed}</span>
          </div>
          <div className="columns shrink text-right more-options-wrapper">
            <span className="item-details">
              <Moment format="MMM DD">{audit.createdDateTime}</Moment>
            </span>
          </div>
        </div>
      );
    });

  // Lists TaskLists
  renderTaskListName() {
    const { activityFeedForAllUserList } = this.props;

    return activityFeedForAllUserList.map((auditsandtasklist) => {
      return (
        <li
          className="slim accordion-item"
          data-accordion-item
          key={`taskList${auditsandtasklist.taskListIdentifier}`}
        >
          <button
            type="button"
            onClick={this.handleClick}
            className="accordion-title"
          >
            {auditsandtasklist.listName}
          </button>
          <div className="accordion-content" data-tab-content>
            {this.renderList(auditsandtasklist.auditList) &&
            this.renderList(auditsandtasklist.auditList).length > 0 ? (
              this.renderList(auditsandtasklist.auditList)
            ) : (
              <p className="light-gray">No Recent Activities</p>
            )}
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul
        className="columns slim large-12 accordion"
        data-accordion
        data-allow-all-closed="true"
      >
        {this.renderTaskListName()}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    activityFeedForAllUserList: state.taskList.activityFeedForAllUserList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TaskListActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListActivityFeedContainer);
