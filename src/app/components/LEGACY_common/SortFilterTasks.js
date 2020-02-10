/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import $ from 'jquery';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../../actions/patient-actions';
import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';

class SortFilterTasks extends PureComponent {
  state = {
    value: '',
    hideForm: true,
    title: '',
    sortBy: 'CREATED_DT',
    filterBy: '',
  };

  componentDidMount() {
    enableFoundationComponent('#nonlist-sort-dropdown');
  }

  componentDidUpdate(prevProps, prevState) {
    enableFoundationComponent('#nonlist-sort-dropdown');
  }

  sortListTasks = sortBy => {
    const { filterBy } = this.state;
    this.setState({ sortBy });
    this.setState({ filterBy: 'NONE' });
    this.props.getListTasks(sortBy, filterBy);
    closeDropdown('#nonlist-sort-dropdown');
  };

  filterListTasks = filterBy => {
    const { sortBy } = this.state;
    this.setState({ filterBy });
    this.setState({ sortBy: 'CREATED_DT' });
    this.props.getListTasks(sortBy, filterBy);
    closeDropdown('#nonlist-sort-dropdown');
  };

  openSortFilterOptions = () => {
    openDropdown('#nonlist-sort-dropdown');
  };

  toggleListNotifications = () => {
    this.props.taskListActions.toggleListNotifications(
      this.props.taskListIdentifier,
      !this.props.taskList.notifications,
    );
  };

  toggleSlimView = () => {
    $(this).toggleClass('active');
    $('.task-item-wrapper').toggleClass('slim');
    $('.task-item .row, .task-item, .main-task-item').toggleClass(
      'align-middle',
    );
  };

  render() {
    const { refresh, title } = this.props;
    const { filterBy, sortBy } = this.state;

    return (
      <div id="sortFilterHeader">
        <div className="wrapper list-filter row collapse align-middle align-right ">
          <div className="columns controls">
            <button
              className="dropdown button primary small"
              data-toggle="nonlist-sort-dropdown"
              onClick={() => this.openSortFilterOptions()}
              type="button"
            >
              Sort / Filter
            </button>
            <div
              className="dropdown-pane button-dropdown"
              id="nonlist-sort-dropdown"
              data-dropdown
              data-close-on-click="true"
              data-auto-focus="true"
            >
              <div className="sortFilterCategory">
                <span>Sort by :</span>
              </div>
              <ul className="no-bullet">
                <li
                  className={
                    sortBy === 'CREATED_DT'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.sortListTasks('CREATED_DT')}
                >
                  Creation date
                </li>
                <li
                  className={
                    sortBy === 'DUE_DT'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.sortListTasks('DUE_DT')}
                >
                  Due date
                </li>
                {title !== 'Patient Tasks' && (
                  <li
                    className={
                      sortBy === 'PATIENT'
                        ? 'sortFilterItem active'
                        : 'sortFilterItem'
                    }
                    onClick={() => this.sortListTasks('PATIENT')}
                  >
                    Patient
                  </li>
                )}
                <li
                  className={
                    sortBy === 'ASSIGNED_BY'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.sortListTasks('ASSIGNED_BY')}
                >
                  Assigned by
                </li>
                {title !== 'Person Tasks' && (
                  <li
                    className={
                      sortBy === 'ASSIGNED_TO'
                        ? 'sortFilterItem active'
                        : 'sortFilterItem'
                    }
                    onClick={() => this.sortListTasks('ASSIGNED_TO')}
                  >
                    Assigned to
                  </li>
                )}
                <li
                  className={
                    sortBy === 'PRIORITY'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.sortListTasks('PRIORITY')}
                >
                  Priority
                </li>
                <li
                  className={
                    sortBy === 'TASK_DESCRIPTION'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.sortListTasks('TASK_DESCRIPTION')}
                >
                  Alphabetical
                </li>
              </ul>
              <div className="sortFilterCategory">
                <span>Filter by :</span>
              </div>
              <ul className="no-bullet">
                <li
                  className={
                    filterBy === 'NONE'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('NONE')}
                >
                  None
                </li>
                {title !== 'Person Tasks' && (
                  <li
                    className={
                      filterBy === 'ASSIGNED_TO_ME'
                        ? 'sortFilterItem active'
                        : 'sortFilterItem'
                    }
                    onClick={() => this.filterListTasks('ASSIGNED_TO_ME')}
                  >
                    Assigned to me
                  </li>
                )}
                <li
                  className={
                    filterBy === 'CREATED_BY_ME'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('CREATED_BY_ME')}
                >
                  Created by me
                </li>
                <li
                  className={
                    filterBy === 'OVERDUE'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('OVERDUE')}
                >
                  Overdue
                </li>
                <li
                  className={
                    filterBy === 'DUE_TODAY'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('DUE_TODAY')}
                >
                  Due Today
                </li>
                <li
                  className={
                    filterBy === 'DUE_THIS_WEEK'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('DUE_THIS_WEEK')}
                >
                  Due This Week
                </li>
                <li
                  className={
                    filterBy === 'DUE_NEXT_WEEK'
                      ? 'sortFilterItem active'
                      : 'sortFilterItem'
                  }
                  onClick={() => this.filterListTasks('DUE_NEXT_WEEK')}
                >
                  Due Next Week
                </li>
              </ul>
            </div>
          </div>

          <div className="columns shrink icon-group controls">
            <span title="Refresh data" onClick={() => refresh()}>
              <svg className="icon refresh">
                <use xlinkHref="#icon-activity" />
              </svg>
            </span>
            <span
              title="Slim view toggle"
              onClick={() => this.toggleSlimView()}
            >
              <svg className="icon toggle-slim">
                <use xlinkHref="#icon-slim" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  taskLists: store.taskListState.tasklist,
  patients: store.patientState.allPatients,
  currentUser: store.userState.user,
});

const mapDispatchToProps = dispatch => ({
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortFilterTasks);
