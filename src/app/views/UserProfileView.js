import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import UserProfileContainer from '../components/people/UserProfileContainer';

const UserProfileView = ({ userProfile }) => {
  return (
    <div className="off-canvas-content" data-off-canvas-content>
      <div className="row expanded collapse">
        <div className="large-12 columns">
          <header className="nav-down">
            <div className="top-bar">
              <div className="top-bar-left">
                <button
                  className="menu-icon hide-for-medium"
                  type="button"
                  data-toggle="sidebar"
                />
                <h3>My Profile</h3>
              </div>
              <div className="top-bar-right">
                <Link to="/logout" className="button small primary">
                  Logout
                </Link>
              </div>
            </div>
          </header>
        </div>
      </div>
      <div className="list-wrapper">
        <UserProfileContainer userProfile={userProfile} />
      </div>
    </div>
  );
};

const mapStateToProps = store => {
  return {
    userProfile: store.userState.userProfile,
  };
};

export default connect(mapStateToProps)(UserProfileView);
