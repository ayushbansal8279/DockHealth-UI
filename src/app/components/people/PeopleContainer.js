import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as PeopleActions from '../../actions/people-actions';
import {Link} from 'react-router';

class PeopleContainer extends React.Component {
    constructor(props) {
      super(props);

      //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
      //Here onClick is the prop and this.onClick is the passed in function
      //renderList() does not need binding as it is NOT passedas a function to prop
      //this.onClick = this.onClick.bind(this);
      this.state = {
          peopleProcessingResult: ''
      };
    }

    componentDidMount () {
      this.props.findAllUsersByOrganizationId();
    }

    renderRole(people){
      if(people.orgUserRole=='OWNER'){
        return (<span className=" success label">{people.orgUserRole}</span>);
      }
      else if(people.orgUserRole=='MEMBER'){
        return (<span className=" warning label">{people.orgUserRole}</span>);
      }
      else{
        return (<span></span>);
      }
    }

    renderRoleButton(people){
      if(people.orgUserRole=='OWNER'){
        return (<span></span>);
      }
      else if(people.orgUserRole=='MEMBER'){
        return (<button className="button small secondary float-right">Give Admin Rights</button>);
      }
      else if(people.orgUserRole=='ADMIN'){
        return (<button className="button small secondary float-right">Remove Admin Rights</button>);
      }
    }

    renderList() {
//use below if date is coming in as timestamp milliseconds
//{new Date(invitation.updatedDateTime).toJSON()}

       return this.props.peoplelist.map((people) =>{
          return(
            <tr key={people.email}>
              <td><span className="label">{people.firstName + ", " + people.lastName}</span></td>
              <td><span className="label">{people.email}</span></td>
              <td>
                {
                  (people.userInviteStatus=='ACCEPTED')
                  ?<div><span className=" success label">{people.userInviteStatus}</span></div>
                  :<div><span className=" alert label">{people.userInviteStatus}</span></div>
                }
              </td>
              <td>
                {
                  this.renderRole(people)
                }
              </td>
              <td>
                {
                  this.renderRoleButton(people)
                }
              </td>
            </tr>
          );
      })
    }

    render(){
      return(
        <div>

        <div className="row">
          <div className="small-12 columns">
          <h3>{this.state.peopleProcessingResult}</h3>
          </div>
        </div>

        <Link to="/peopleinvite">
          <button className="button secondary button-small float-right">Invite User To Org</button>
        </Link>

        <div className="row">
          <div className="small-12 columns">
          <h4>List of memebers within organization</h4>
          </div>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200" ><h3>Name</h3></th>
                <th width="200" ><h3>Email</h3></th>
                <th width="200" ><h3>Status</h3></th>
                <th width="200" ><h3>Role</h3></th>
                <th width="400" ></th>
              </tr>
            </thead>

            <tbody>
              {this.renderList()}
            </tbody>
          </table>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    peoplelist: state.peopleState.peoplelist
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(PeopleActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
