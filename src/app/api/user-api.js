/**
 * Wrapper around AWS Cognito auth
 */
import configureStore from '../configureStore'

const store = configureStore();

const {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} = window.AWS.CognitoIdentityServiceProvider

export let cognitoUser = null

window.AWS.config.region = process.env.AWS_REGION
window.AWS.config.userPoolId = process.env.AWS_USERPOOLID
window.AWS.config.identityPoolId = process.env.AWS_IDENTITYPOOLID

const userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_USERPOOLID,
  ClientId: process.env.AWS_CLIENTAPP
})

// register a new user
export function register (userData) {
  const attributeList = []
  const {username, password, ...user} = userData
  for (let field in user) {
    attributeList.push(new CognitoUserAttribute({ Name: field, Value: user[field] }))
  }
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) return reject(err)
      cognitoUser = result.user
      store.dispatch({type: 'user/user', user: cognitoUser})
      resolve(result.user)
    })
  })
}

// confirm user registration
export function confirmRegistration (userData) {
  const attributeList = []
  const {username, confirmationCode} = userData
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
        if (err) {
            return reject(err)
        } else {
            cognitoUser = result.user
            store.dispatch({type: 'user/user', user: cognitoUser})
            resolve(result.user)
        }
    })
  })
}

// resend code
export function resendConfirmationCode (userData) {
  const attributeList = []
  const {username} = userData
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
            return reject(err)
        } else {
            //cognitoUser = result.user
            //store.dispatch({type: 'user/user', user: cognitoUser})
            resolve(result.user)
        }
    })
  })
}

// log user out
export function logout () {
  cognitoUser.signOut()
  cognitoUser = null
  store.dispatch({type: 'user/user', user: cognitoUser})
}

// authenticate user, and also ask for MFA or verification code, if needed
export function login (Username, Password) {
  return new Promise((resolve, reject) => {
    var authenticationData = {
        Username : Username,
        Password : Password,
    };
    var authenticationDetails = new window.AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var cognitoUserData = {
        Username : Username,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken())
        
        

        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId : '...' // your identity pool id here
        //     Logins : {
        //         // Change the key below according to the specific region your user pool is in.
        //         'cognito-idp.us-east-1.amazonaws.com/us-east-1_TcoKGbf7n' : result.getIdToken().getJwtToken()
        //     }
        // })
        
        let cognitoUser = userPool.getCurrentUser();
        store.dispatch({type: 'user/user', user: cognitoUser})
        resolve(result)
        /*
        var logins = {}
        logins['cognito-idp.' + window.AWS.config.region + '.amazonaws.com/' + userPool.userPoolId] = result.getIdToken().getJwtToken();
        
        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: window.AWS.config.identityPoolId,
            Logins: logins
        });

        AWS.config.credentials.get(function (err) {
            if (!err) {
                var id = AWS.config.credentials.identityId;
                console.log(AWS.config.credentials)
            }
        });
        
        console.log("set the AWS credentials - " + JSON.stringify(AWS.config.credentials));
        console.log("set the AWSCognito credentials - " + JSON.stringify(AWSCognito.config.credentials));
        */
      },
      onFailure: reject
    })
  })
}

export function isAuthenticated (callback) {
        if (callback == null)
            throw("Callback in isAuthenticated() cannot be null");
        let cognitoUser = userPool.getCurrentUser();
        console.log('cognitoUser: '+cognitoUser)
        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false, cognitoUser);
                }
                else {
                    console.log("Session is " + session.isValid());
                    callback.isLoggedIn(err, session.isValid(), cognitoUser);
                }
            });
        } else {
            console.log("Can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false, cognitoUser);
        }
}

// allow user to reset password
export function reset () {
  console.log('Not implemented.')
}