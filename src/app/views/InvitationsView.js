import React from 'react';

import InvitationContainer from '../components/invitation/InvitationContainer'


class InvitationsView extends React.Component {
    render() {
      return (
        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">

              <header className="nav-down">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>Invitations</h3> 
                </div>
              </div>

              </header>

              <InvitationContainer/>
              
            </div>
          </div>
        </div>
      );
  }
}

export default InvitationsView;
