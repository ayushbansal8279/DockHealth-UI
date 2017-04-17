import React from 'react'
import { Link } from 'react-router'
import Request from 'superagent';
import _ from 'lodash';


class Test extends React.Component{
	constructor(){
		super();
		this.state = {};
	}

	componentWillMount(){
		var url = "http://localhost:8080/heydoc-services/patient/getAllPatientsByOrganizationId/1?active=true";
		Request.get(url).then((response) => {
			this.setState({
				patients: response.body
			});
		});
	}

	componentDidMount(){

	}

	componentWillReceiveProps(nextProps){

	}

	componentWillUpdate(nextProps, nextState){

	}

	render(){
		var patients = _.map(this.state.patients, (patient) =>{
			return <li>{patient.firstName}</li>;
		});
		return <div>
		<p>Patient:</p>
			<ul>{patients}</ul>
		</div>

	}
}

Test.route = { path: '*', component: Test }

export default Test