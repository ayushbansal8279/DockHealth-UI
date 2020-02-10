import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskListActions from '../../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';

class TaskListUsers extends PureComponent {
  componentDidMount() {
    // this.props.getMembersByTaskListId(taskListIdentifier, memberStatus)
    if (this.props.taskListIdentifier) {
      this.props.getMembersByTaskListId(this.props.taskListIdentifier, 'ALL');
    }
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'TaskListUsers',
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.taskListIdentifier && nextProps.taskListIdentifier != this.props.taskListIdentifier) {
      this.props.getMembersByTaskListId(nextProps.taskListIdentifier, 'ALL');
    }
  }

  render() {
    return (
      <div className="content-block">
        <h6>Invited to this list</h6>
        {this.props.members &&
          this.props.members.map(member => {
            return (
              <div className="avatar" key={member.userIdentifier}>
                <div
                  className="users"
                  title={`${member.firstName} ${member.lastName}`}
                >
                  {member.initials}
                </div>
                {member.status == 'ACTIVE' ? (
                  <svg className="icon medium green">
                    <use xlinkHref="#icon-ok" />
                  </svg>
                ) : (
                  <svg className="icon medium gray">
                    <use xlinkHref="#icon-minus" />
                  </svg>
                )}
              </div>
            );
          })}
        <a>
          <svg className="add-send-text icon memberphoto large">
            <use xlinkHref="#icon-add" />
          </svg>
        </a>
        <button className="button secondary block">
          Send Text{' '}
          <svg className="icon">
            <use xlinkHref="#icon-forward" />
          </svg>
        </button>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { members: store.taskListState.tasklistmembers };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(TaskListActions, dispatch);
};

// export default TaskListUsers
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListUsers);
