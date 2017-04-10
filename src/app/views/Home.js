import React from 'react'
import NavBar from '../components/common/NavBar'
import Header from '../components/common/Header'
import TaskFilters from '../components/task/TaskFilters'
import TaskList from '../components/task/TaskList'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import TaskListContainer from '../components/task/TaskListContainer'
import Notification from '../components/common/Notification'

//const App = () => (
class Home extends React.Component {
    render() {
    return (    
<div>        
	<NavBar />
	<Header />

	<div className="row">
		<div className="large-8 columns task-list-container">
			<TaskFilters />
			<TaskListContainer />
		</div>
		<div className="large-4 columns sidebar">
			<TaskListUsers />
			<TaskListPatients />
		</div>
	</div>

  <Notification />
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

export default Home


Home.route = { component: Home }
