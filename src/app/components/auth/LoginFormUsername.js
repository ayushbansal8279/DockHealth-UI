import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link, browserHistory, hashHistory } from 'react-router'
import AuthField from '../common/AuthField'
import queryString from 'query-string'
import * as UserApi from '../../api/user-api'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Please enter an email address'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.username)) {
    errors.username = 'Please enter a valid email address'
  }
  return errors
}

export class LoginFormUsername extends Component {

  constructor(props){
    super(props)
    this.state = {
        showLoginMessage: false
    };
  }

  componentWillMount () {
    console.log('href= '+window.location.href)
    if(window.location.href){
      var index = window.location.href.indexOf("?")
      var queryStr = window.location.href.substr(index+1, window.location.href.length-1)
      const queryValues=queryString.parse(queryStr);
      console.log(queryValues)
      if(queryValues.code !== undefined){
        this.setState({showLoginMessage: true})
        var authCode = queryValues.code.replace('\#\/login', '');
        console.log('authCode: '+authCode)
        // UserApi.getAccessTokensByAuthCode(authCode).then((res) => {
        UserApi.getEnterpriseAccessTokensByAuthCode(authCode).then((res) => {
          // hashHistory.push('/taskList')
          window.location.href = '/#/taskList'
          this.setState({showLoginMessage: false})
        })
        .catch((e) => {
					toggleAlert(e.message, "error")
        })
      }
    }
  }
  
  // componentWillUpdate(nextProps){
  //   console.log('upon update href= '+window.location.href)
  //   if(window.location.href){
  //     var index = window.location.href.indexOf("?")
  //     var queryStr = window.location.href.substr(index+1, window.location.href.length-1)
  //     const queryValues=queryString.parse(queryStr);
  //     console.log(queryValues)
  //   }
  // }

  render() {
    const { handleSubmit, invalid, pristine, submitting } = this.props
    return (
      <form className="inline-label top-buffer" onSubmit={handleSubmit}>
        {!this.state.showLoginMessage &&
        <div className="row expanded">
          <h4>Login to your account</h4>
          <Field name='username' type='text' component={AuthField} label='Email' xlinkHref="#icon-email"/>

          <div className="columns small-6 text-center top-buffer">
            <input id="loginButton" type="submit" className="button secondary expand" value="Next"/>
            {/*<p><button className={'button is-primary is-large'} type='submit'>Login</button></p> */}
          </div>
          <div className="columns small-12" style={{marginTop: "200px"}}>
            <span>Don’t have an account yet ?</span>
            <div className="columnssmall-6 text-left details">
              <Link to="/register">Create account</Link>
            </div>
            {/* <div className="columns small-6 top-buffer text-right details">
              <Link to="/confirmRegistration">Confirm registration</Link>
            </div> */}
          </div>
        </div>
        }
        {this.state.showLoginMessage &&
        <div>
          <h3>Signing you in ...</h3>
          <div className="sk-circle" style={{margin:0}}>
            <div className="sk-circle1 sk-child"></div>
            <div className="sk-circle2 sk-child"></div>
            <div className="sk-circle3 sk-child"></div>
            <div className="sk-circle4 sk-child"></div>
            <div className="sk-circle5 sk-child"></div>
            <div className="sk-circle6 sk-child"></div>
            <div className="sk-circle7 sk-child"></div>
            <div className="sk-circle8 sk-child"></div>
            <div className="sk-circle9 sk-child"></div>
            <div className="sk-circle10 sk-child"></div>
            <div className="sk-circle11 sk-child"></div>
            <div className="sk-circle12 sk-child"></div>
          </div>
        </div>
        }
      </form>
    )
  }
}



export default reduxForm({
  form: 'LoginFormUsername',
  validate
})(LoginFormUsername)
