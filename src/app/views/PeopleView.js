import React from 'react';

import PeopleContainer from '../components/people/PeopleContainer'


class PeopleView extends React.Component {
    render() {
      return (
        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <PeopleContainer/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default PeopleView;
