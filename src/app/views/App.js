import React from 'react'
import PropTypes from 'prop-types';
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import Notification from '../components/common/Notification'

class App extends React.Component {
  render() {
    return (    
      <div id='appHome'>
        <main>
        <div>        
          <NavBar />
          <Header />
          {this.props.children}

          <Notification />
        </div>
        </main>
        <Notification />
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

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App