import React from 'react'
import PropTypes from 'prop-types';

class TemplateAuthBase extends React.Component {
  render() {
    return (    
      <div className="bg-image row expanded auth-container">
        <div className="gradient-overlay" style={{backgroundColor: "rgba(46, 58, 67, 0.5)"}}></div>
        <div className="wrapper row large-12 large-offset-0 medium-10 medium-offset-1 small-10 small-offset-1" 
          style={{marginTop: "50px", marginBottom: "50px", padding: "0px", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)"}}>
          <div className="columns large-6 large-offset-0 medium-6 medium-offset-0 small-12 small-offset-0"
            style={{backgroundColor: "#ffffff", borderRadius: "6px"}}>
            <div className="row expanded text-center">
              <div className="columns small-12" style={{marginTop: "10px"}}>
                <img className="dock-logo" src="assets/img/dock-logo.png" alt="Dock Health"/>
              </div>
            </div> 
            {this.props.children}
          </div>
          {/* <div className="columns large-6 large-offset-0 medium-4 medium-offset-1 small-10 small-offset-1" 
            style={{backgroundColor: "#ff0000"}}>
            <div className="row expanded text-center" style={{backgroundColor: "#ff0000"}}>
              <h3>&nbsp;</h3>
            </div>
          </div> */}
          <div className="columns large-6 large-offset-0 medium-6 medium-offset-0 small-12 small-offset-0"
            style={{backgroundColor: "rgba(256, 256, 256, 0.2)"}}>
            <div className="row expanded text-center">
                <h3>&nbsp;</h3>
            </div> 
          </div>          
        </div>
      </div>
    );
  }
}

TemplateAuthBase.propTypes = {
  children: PropTypes.object.isRequired
};

export default TemplateAuthBase