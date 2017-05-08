import React from 'react';

import InvitationContainer from '../components/invitation/InvitationContainer'


class InvitationsView extends React.Component {
    render() {
      return (
        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <InvitationContainer/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default InvitationsView;
