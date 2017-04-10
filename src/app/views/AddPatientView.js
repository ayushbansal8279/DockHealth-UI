import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import FormPatient from '../components/patient/FormPatient'

//const App = () => (
class AddPatientView extends React.Component {
    render() {
    return (    
<div>        
	<NavBar />
	<Header />

	<div className="content-block">
    <div className="row">
      <div className="large-8 columns task-list-container">
        <FormPatient />
      </div>
      <div className="large-4 columns sidebar">
      </div>
    </div>
  </div>

</div>
    );
  }

  componentDidMount () {
    //alert('componentDidMount');
    this.renderFoundationComponents();
  }

  componentDidUpdate () {
    //alert('componentDidUpdate');
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

export default AddPatientView

AddPatientView.route = {
  path: 'addPatient',
  component: AddPatientView
}