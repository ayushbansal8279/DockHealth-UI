import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';

import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';

const NavLink = ({ to, children, className }) => (
  <li>
    <Link activeClassName="active" className={className} to={to}>
      {children}
    </Link>
  </li>
);

const LinksAuth = ({ user, userProfilePicThumb }) => (
  <Link to="/userprofile">
    <div
      data-toggle="profile-dropdown"
      className="align-middle row user-profile-link link"
    >
      {userProfilePicThumb ? (
        <img
          className="medium member-photo circle"
          src={`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${user.userIdentifier}/${userProfilePicThumb}`}
          alt={`${user.firstName} ${user.lastName}`}
        />
      ) : (
        <span className="medium member-initials circle">{user.initials}</span>
      )}
      {`${user.firstName} ${user.lastName}`}
    </div>
  </Link>
);

const NavBar = ({ isList, taskLists, userProfile }) => {
  const menuClasses = 'menu float-right';
  return (
    <div
      className="off-canvas position-left reveal-for-medium"
      id="sidebar"
      data-off-canvas
    >
      <LinksAuth
        className={menuClasses}
        user={userProfile}
        userProfilePicThumb={userProfile.profilePictureHash}
      />
      <ul className="menu vertical outer">
        <li>
          <Link to="/activityfeed" className="center-content-vertical">
            <svg className="icon medium">
              <use xlinkHref="#icon-activity" />
            </svg>
            Activity
          </Link>
          <ul className="nested vertical menu">
            <NavLink activeClassName="active" to="/tasks/assigned_to_me">
              Assigned to me
            </NavLink>
            <NavLink activeClassName="active" to="/tasks/assigned_by_me">
              Assigned by me
            </NavLink>
          </ul>
        </li>
        <NavLink
          to="/taskSearch"
          id="search-link"
          className="center-content-vertical "
        >
          <svg className="icon medium">
            <use xlinkHref="#icon-search" />
          </svg>
          Search
        </NavLink>
        <li>
          <Link
            to="/tasks/Inbox"
            activeClassName="active"
            id="inbox-link"
            className="center-content-vertical "
          >
            <svg className="icon medium">
              <use xlinkHref="#icon-envelope-open" />
            </svg>
            Inbox
          </Link>
          <Link
            to="/taskList"
            activeClassName="active"
            className={`center-content-vertical ${isList && 'active'}`}
          >
            <svg className="icon medium">
              <use xlinkHref="#icon-list" />
            </svg>
            Lists
          </Link>
          <ul className="nested vertical menu">
            {taskLists &&
              taskLists.length > 0 &&
              taskLists.map(taskList => (
                <NavLink
                  to={`/tasks/${taskList.taskListIdentifier}`}
                  activeClassName="active"
                  title={taskList.listName}
                  key={taskList.taskListIdentifier}
                >
                  <span className="list-logo small" />
                  {taskList.listName}
                </NavLink>
              ))}
          </ul>
        </li>
        <NavLink to="/people" className="center-content-vertical">
          <svg className="icon">
            <use xlinkHref="#icon-user" />
          </svg>
          People
        </NavLink>
        <NavLink to="/patients" className="center-content-vertical">
          <svg className="icon">
            <use xlinkHref="#icon-patient" />
          </svg>
          Patients
        </NavLink>
        <NavLink to="/support" className="center-content-vertical">
          <svg className="icon">
            <use xlinkHref="#icon-patient" />
          </svg>
          Support
        </NavLink>
      </ul>
      <div className="share-wrapper hide">
        <div className="social-media text-center">
          <button type="button">
            <svg className="icon">
              <use xlinkHref="#icon-twitter" />
            </svg>
          </button>
          <button type="button">
            <svg className="icon">
              <use xlinkHref="#icon-facebook" />
            </svg>
          </button>
          <button type="button">
            <svg className="icon">
              <use xlinkHref="#icon-linkedin" />
            </svg>
          </button>
          <button type="button">
            <svg className="icon">
              <use xlinkHref="#icon-linkedin" />
            </svg>
          </button>
        </div>
        <div className="invite-email">
          <svg className="icon">
            <use xlinkHref="#icon-email" />
          </svg>
          Invite friends via email
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = store => ({
  user: store.userState.user,
  userProfile: store.userState.userProfile,
  userProfilePic: store.userState.userProfilePic,
  taskLists: store.taskListState.tasklist,
  isList: store.taskListState.isList,
});

const mapDispatchToProps = dispatch => ({
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

const ConnectedNavBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);

export default ConnectedNavBar;
