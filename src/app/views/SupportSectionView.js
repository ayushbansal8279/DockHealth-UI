import React from 'react';
import BaseComponent from '../components/BaseComponent';

class SupportSectionView extends BaseComponent {
  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <header className="nav-down">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar" />
                  <h3>DockHealth Support</h3>
                </div>
              </div>
            </header>
            <div className="list-wrapper">
              <div className="row">
                <div className="column">
                  <h5> For DockHealth support, email us at <a href="mailto:support@dock.health?Subject=Dock%20Support" target="_top">support@dock.health</a></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default SupportSectionView;
