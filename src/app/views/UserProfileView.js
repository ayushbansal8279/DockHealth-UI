import React from 'react';

import UserProfileContainer from '../components/people/UserProfileContainer'


class UserProfileView extends React.Component {
    render() {
      return (
        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <UserProfileContainer/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default UserProfileView;
