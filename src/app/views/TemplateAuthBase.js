import React from 'react'
import PropTypes from 'prop-types';

class TemplateAuthBase extends React.Component {
  render() {
    return (    
      <div className="bg-image row expanded">
        <div className="gradient-overlay"></div>
        <div className="wrapper columns align-self-middle large-6 large-offset-3 medium-8 medium-offset-2 small-12">
          <div className="row expanded text-center">
            <div className="columns small-12">
              <img className="dock-logo" src="assets/img/dock-logo-white.png" alt="Dock Health"/>
            </div>
          </div> 
          {this.props.children}
        </div>
      </div>
    );
  }
}

TemplateAuthBase.propTypes = {
  children: PropTypes.object.isRequired
};

export default TemplateAuthBase