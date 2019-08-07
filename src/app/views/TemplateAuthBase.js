import React from 'react'
import PropTypes from 'prop-types';

class TemplateAuthBase extends React.Component {
  render() {
    return (    
      <div className="bg-image row expanded auth-container">
        <div className="gradient-overlay"></div>
        <div className="wrapper columns align-self-middle large-4 large-offset-1 medium-4 medium-offset-1 small-10 small-offset-1"
          style={{backgroundColor: "#ffffff"}}>
          <div className="row expanded text-center">
            <div className="columns small-12">
              <img className="dock-logo" src="assets/img/dock-logo.png" alt="Dock Health"/>
            </div>
          </div> 
          {this.props.children}
        </div>
        <div className="wrapper columns align-self-middle large-4 large-offset-1 medium-4 medium-offset-1 small-10 small-offset-1" 
          style={{}}>
          <h3>&nbsp;</h3>
        </div>
      </div>
    );
  }
}

TemplateAuthBase.propTypes = {
  children: PropTypes.object.isRequired
};

export default TemplateAuthBase