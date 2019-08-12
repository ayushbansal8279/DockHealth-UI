import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link, browserHistory, hashHistory } from 'react-router'
import AuthField from '../common/AuthField'
import AuthFieldAutoFocus from '../common/AuthFieldAutoFocus'
import queryString from 'query-string'
import * as UserApi from '../../api/user-api'

const validate = values => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Please enter a password'
  }

  return errors
}

export class LoginFormPassword extends Component {

  constructor(props){
    super(props)
    this.passwordInput = null;
  }

  componentDidMount() {
    this.passwordInput.focus();
  }

  componentWillMount () {
    // console.log('href= '+window.location.href)
    // if(window.location.href){
    //   var index = window.location.href.indexOf("?")
    //   var queryStr = window.location.href.substr(index+1, window.location.href.length-1)
    //   const queryValues=queryString.parse(queryStr);
    //   console.log(queryValues)
    //   if(queryValues.code !== undefined){
    //     var authCode = queryValues.code.replace('\#\/login', '');
    //     console.log('authCode: '+authCode)
    //     UserApi.getAccessTokensByAuthCode(authCode).then((res) => {
    //       // hashHistory.push('/taskList')
    //       window.location.href = '/#/taskList'
    //     })
    //     .catch((e) => {
		// 			toggleAlert(e.message, "error")
    //     })
    //   }
    // }
  }

  render() {
    const { handleSubmit, invalid, pristine, submitting } = this.props
    return (
      <form className="inline-label top-buffer" onSubmit={handleSubmit}>
        <div className="row expanded">
          <h5>Please enter your password</h5>
          <Field name='password' type='password' component={AuthFieldAutoFocus} label='' xlinkHref="#icon-password" 
            setFieldToBeFocused={input => {
              this.passwordInput = input;
            }}/>
          <div className="columns small-6 text-center top-buffer">
            <input id="loginButton" type="submit" className="button secondary expand" value="Login"/>
            {/*<p><button className={'button is-primary is-large'} type='submit'>Login</button></p> */}
          </div>

          <div className="columns small-12" style={{marginTop: "200px"}}>
            <div className="small-6 text-left details">
              <Link to="/forgotPassword">Forgot password ?</Link>
            </div>
            <div className="small-6 text-left details top-buffer">
              <Link to="/login">Re-enter Email</Link>
            </div>
          </div>
        </div>
      </form>
    )
  }
}



export default reduxForm({
  form: 'LoginFormPassword',
  validate
})(LoginFormPassword)
