import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import PatientListContainer from '../components/patient/PatientListContainer'

//const App = () => (
class AllPatientsView extends React.Component {
    render() {
    return (    
<div>        
	<NavBar />
	<Header />

	<div className="content-block">
    <div className="row">
      <div className="large-8 columns task-list-container">
        <PatientListContainer />
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

export default AllPatientsView

AllPatientsView.route = {
  path: 'patientList',
  component: AllPatientsView
}