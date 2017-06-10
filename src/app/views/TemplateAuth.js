import React from 'react'
import PropTypes from 'prop-types';
import NavBarNoLogin from '../components/common/NavBarNoLogin'
import Notification from '../components/common/Notification'

class TemplateAuth extends React.Component {
  render() {
    return (    
        <div>    
          {/*<NavBarNoLogin/>   */}
          {this.props.children}

          {/*<Notification />*/}
        </div>
    );
  }

  componentDidMount () {
    this.renderFoundationComponents();
  }

  componentDidUpdate () {
    this.renderFoundationComponents();
  }

  renderFoundationComponents () {
  // render the buy button with jQuery
  //$(this.refs.container).html(
    renderFoundationComponentsJquery();
  //);
  }
//)
}

TemplateAuth.propTypes = {
  children: PropTypes.object.isRequired
};

export default TemplateAuth