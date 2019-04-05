import axios from './axios-heydoc';
import configureStore from '../configureStore'
const store = configureStore();

const {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} = window.AWSCognito.CognitoIdentityServiceProvider

export let resolvedCognitoUser = null

window.AWSCognito.config.region = process.env.AWS_REGION
window.AWSCognito.config.userPoolId = process.env.AWS_USERPOOLID
window.AWSCognito.config.identityPoolId = process.env.AWS_IDENTITYPOOLID

const userPool = new CognitoUserPool({
  UserPoolId: process.env.AWS_USERPOOLID,
  ClientId: process.env.AWS_CLIENTAPP
})

// register a new user
export function register (userData) {
  const attributeList = []
  let {username, password, ...user} = userData
  if(username){
    username = username.toLowerCase()
  }
  for (let field in user) {
    attributeList.push(new CognitoUserAttribute({ Name: field, Value: user[field] }))
  }
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) return reject(err)
      resolvedCognitoUser = result.user
      store.dispatch({type: 'user/user', user: resolvedCognitoUser})
      //enable MFA
      /*
      resolvedCognitoUser.enableMFA(function(err, result) {
        if (err) {
            //alert(err);
            return;
        }
        console.log('enabled MFA: ' + result);
      });
      */

      resolve(result.user)
    })
  })
}

// confirm user registration
export function confirmRegistration (userData) {
  const attributeList = []
  let {username, confirmationCode} = userData
  if(username){
    username = username.toLowerCase()
  }
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
          /*
            console.log('creating heydoc user');
            createUser({
              firstName: "Test",
              lastName: "Test",
              email: cognitoUser.username
            })
          */
            resolve(result.user)
        }
    })
  })
}

// resend code
export function resendConfirmationCode (userData) {
  const attributeList = []
  let {username} = userData
  if(username){
    username = username.toLowerCase()
  }
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
            resolvedCognitoUser = result.user
            //store.dispatch({type: 'user/user', user: resolvedCognitoUser})
            resolve(resolvedCognitoUser)
        }
    })
  })
}

// log user out
export function logout () {
  return new Promise((resolve, reject) => {
    let cognitoUser = userPool.getCurrentUser();
    if(cognitoUser != null){
      cognitoUser.signOut()
      resolvedCognitoUser = null
      store.dispatch({type: 'user/user', user: resolvedCognitoUser})
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('sessionStartTime');
      resolve();
    }
    else{
      reject();
    }
  })
}

// authenticate user, and also ask for MFA or verification code, if needed
export function login (username, password) {
  if(username){
    username = username.toLowerCase()
  }
  return new Promise((resolve, reject) => {
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new window.AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var cognitoUserData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(cognitoUserData)
    resolvedCognitoUser = cognitoUser
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

// {AuthenticationResult: {,…}, ChallengeParameters: {}}
// AuthenticationResult
// :
// {,…}
// AccessToken
// :
// "eyJraWQiOiJuQWxhN3ZVTkQxVWlSVjRGRXpmczk1MXpNaVYyeWlIYjI2Tmo5MVdpY0hVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZmM4YmEzYS1iOTcxLTQ1YjEtYTQ2OS01Yzc0MzE2ZTc5MjkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfekFmQVpxek12IiwiZXhwIjoxNDkyMTMwMjA4LCJpYXQiOjE0OTIxMjY2MDgsImp0aSI6IjhhNjAxYWE4LTE0ZGUtNDc4Yy1hYmQ0LTY1Mzg4OGZmYThkMCIsImNsaWVudF9pZCI6IjVyNG01Z20xaW4yNGJpYWxyamZkZjRtOHZrIiwidXNlcm5hbWUiOiJ0ZXN0MDEifQ.dj5246gTsI8xRihDWZSfkP9OWlh1AhqxIz3gsUkRe1nl3yCyGyb8N2-Vvl0Pl-sD3Uo9MHOYiMEnOG5ryGwbjln4QL692AcS00i8kQEp-AnRpTGQ2TUiPoZgq7NNLxtZsmcstXXuoZc9xml8W3dgyCzFc_r82WTJwzNMtFwqz1_gQlwA61KCMBy_EcraHbbDkEzz3yImoA2VYkd1xPZUeJqEx0bEaeS2BiRH3wKlR5xkbNr9lMIm-Fau18NoNcbm9bTLM9To4_lTbhTLTKjdW3MMbjNgCXrSZ4lxAYaY-McRjv52ETx2zvmmR9rxmmSG7Fa50y02efsvxbb9lQODmA"
// ExpiresIn
// :
// 3600
// IdToken
// :
// "eyJraWQiOiJMRUFPc1Jnb0xzOWJ1aHlHSVltN25cL0dVUFRoYm40bnRlYVFJR2M3TkV1QT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyZmM4YmEzYS1iOTcxLTQ1YjEtYTQ2OS01Yzc0MzE2ZTc5MjkiLCJhdWQiOiI1cjRtNWdtMWluMjRiaWFscmpmZGY0bTh2ayIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTQ5MjEyNjYwOCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfekFmQVpxek12IiwiY29nbml0bzp1c2VybmFtZSI6InRlc3QwMSIsImV4cCI6MTQ5MjEzMDIwOCwiaWF0IjoxNDkyMTI2NjA4LCJlbWFpbCI6Im5pdGluZ3VqcmFsQHlhaG9vLmNvbSJ9.AAbwuXRSUGqTKnXVolMVikVGk1B3f2b6Sb-8DP2tf_WtAaqeHnDteIXHqE4zspWyfP7C76VsW0nY2UV9gxevng_3XSgNmMLJQYGsRHv5mgCreTpmA8cpYGsnVB7_dbI2UDRdlSRiWis_EFpCIvKyhWWZyTUIAiPlMih6iHsDssJiDRF0pQUjaKZSpF5kx3azjV32bG1s-s4J8NHDUQA3ghwHiLfE8Fv1DDY_bubSH10QJPaJRftKbc4aOw4wS7q9uKeVy4yf75fW5uWCYI0prlZIKGc1M-4ASMhDiHcv_7vhh_mODRciKHG9S1gOeWz1vhHK9Uh5IWl6XKsJ7-Z3VQ"
// RefreshToken
// :
// "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.lHXaSHMoghPojIyIK1TtMmCjaxA15ouz89iPwhslfHZdLSdq9xMEC1NxshKLdrVu0T905lQZpoNcyfLPwGRerch2yjPoLDVENvmNAbBAP2dC-f-hFlSPBzbcYyvagevzPfeIwSesXtSWd9LsIh5Zz6DnxANLX2uT18WrOCFjf2DRfaXIHZeV-Zp7pMGma4O5QQFyz-xdIdIjMi961bQPjDEInkos1CTodbzQKM7MUiUT8MNaN0RbHnCIihjG7hmfC05H1yx8m3mdmWl3pPrcXeZe00dX9SHr2dNwoMtP4SM4mIIhclTip6eatgovLtxdHlJSufpPH12WkzP35_sX0w.1Kuu0ia7m9M0_25R.DdStmexI2NHwjVGzufIdCqcnRiis6JHTjP4LfTKHMPd2AvLJQUwT_L8CvSxom6xmxP513VzNRYPkqdxWAbfS9MvTOo6K7jfEKCn4v251jBgC90p_F0CJ7Sl5V936SqWWrIf6f9sIgVx5hyErGz8ruaAbuosPVimQA1d30nL8Wv28YYNLMeYGiRSpizyAKZJcpCp3WYeap3EgOh_DPXGsuMx7l4HyJWgu8ow_1APMaZoXRQ5rpF76CQy8AoIZ3h3_HPMIzoy6C3CseGcZqDrT7WaCHiDK4FzgJJzElB8D7XaAtf1D_a-zBHO3tU7EO--h5c8MuRAW6yDLv1budpcUb59-OEN3mBlHHkFapxwZ_GypTV7JKW28JfHgcwZwFyTHn8JVzlMPN9OByfjtCPJiXFJ7Q6P5kLyYcGjUBNf4FUJ2ypLwnBXf25S3cdFb1gsb1AP73IKXK8c7gFJ87dLwkJS5V4qlTGo3ZExcW8qL17trFX12ayJ-bissrZg_PC4b2GZXV-ixsrK-ZunaW6eHoRz_qIdkj6NwLhHbmGgDDsBTnyF65HLrJfX8I5lzyEKlrwoqJ9fJfP2CpvgUyqqQU_J1JPVMS9Y__LLiB2bNk71d7JVy9p7BXjyLa2130XuAsw8Kqnzb66ypwWReAWPKsWFh7_PEGIkiXVHomKtxGtHOinDtxNKjBR9Baxa4jlZpbe0hixL4fZoxqoxetujfZ2gqpBBga6wdPRE7wzWDCQ3VryJx9m9L0KrYOHS5Bvam_2ucl7LX7xvih0VxNosEP4MaloglMhjJMrEWQbZKh_2yhfGRzxpwC50xrctH0YlwRvQLiKi6U59rco_Kt_PV-QUdzVTJfNhlz7ejW7pVprIYd2U7QY3fEi5W97Q3Cnzon-xazZ58OOKQOWelTqda831ZrZWscl7MkuK4bz5qKMZF_N7qnW0Q0fjQ7E3967zDfkzdp1Nx4OP-lv4Z8TOM4DyDMUI-BTcE-hggOBIdZKC8ubDLy0W1YRffVIhmiyGJ3xNYeGkh3bFA7SldGjdRhZccnIcN_IpwPXwvypHXQqJ7Ctf3vhCF5F744AprI7bETrrTTeAuoIuMzXfyv8r8YGlj0EtSYYX8bY1t_2fimEre-u55LcTdNl_m3ltSjUN959c5.CLJuKJuVfoX6fl2GT8J9nQ"
// TokenType
// :
// "Bearer"
// ChallengeParameters
// :
// {}

        store.dispatch({type: 'user/user', user: resolvedCognitoUser})
        resolve(result)
        /*
        var logins = {}
        logins['cognito-idp.' + window.AWSCognito.config.region + '.amazonaws.com/' + userPool.userPoolId] = result.getIdToken().getJwtToken();

        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: window.AWSCognito.config.identityPoolId,
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

      onFailure: reject,

      mfaRequired: function(codeDeliveryDetails) {
          // MFA is required to complete user authentication.
          // Get the code from user and call
          console.log("MFA code is needed")
          resolve(codeDeliveryDetails)
      }
    })
  })
}

// confirm user registration
export function sendMFACode (userData) {
  const attributeList = []
  let {username, mfaCode} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = resolvedCognitoUser //ensure we use the same cognitoUser object from authenicate call since it needs the session to be initialized
    cognitoUser.sendMFACode(mfaCode, {
      onSuccess: function (result, userConfirmationNecessary) {
        console.log('access token + ' + result.getAccessToken().getJwtToken())

        store.dispatch({type: 'user/user', user: resolvedCognitoUser})
        resolve(result)

      },
      onFailure: reject
    })
  })
}

//remember the device
export function rememberDevice () {
  return new Promise((resolve, reject) => {
    var cognitoUser = resolvedCognitoUser //ensure we use the same cognitoUser object so the deviceKey is set from the localstorage
    if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false, cognitoUser);
                }
                else {
                    console.log("Session is " + session.isValid());
                    cognitoUser.setDeviceStatusRemembered({
                        onSuccess: function (result) {
                            console.log('call result: ' + result);
                            resolve(result)
                        },
                        onFailure: function(err) {
                            //alert(err);
                        }
                    })
                }
            })
    }
  })
}


export function isAuthenticated (callback) {
        if (callback == null)
            throw("Callback in isAuthenticated() cannot be null");
        let cognitoUser = userPool.getCurrentUser();
        //console.log('cognitoUser: '+JSON.stringify(cognitoUser))
        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false, cognitoUser);
                }
                else {
                    console.log("Session is " + session.isValid());
                    sessionStorage.setItem('accessToken', cognitoUser.signInUserSession.accessToken.jwtToken);
                    //sessionStorage.setItem('refreshToken', cognitoUser.signInUserSession.refreshToken.token);
                    // NOTE: getSession must be called to authenticate user before calling getUserAttributes
                    cognitoUser.getUserAttributes(function(err, attributes) {
                        if (err) {
                            // Handle error
                        } else {
                            // Do something with attributes
                        }
                    });

                    callback.isLoggedIn(err, session.isValid(), cognitoUser);
                }
            });
        } else {
            console.log("Can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false, cognitoUser);
        }
}

export function forgotPassword (userData) {
  const attributeList = []
  let {username} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
          resolve(result.user)
          //callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
          console.log(err);
          return reject(err)
          //callback.cognitoCallback(err.message, null);
      },
      inputVerificationCode: function(data) {
          console.log('Code sent to: ' + data.CodeDeliveryDetails.Destination);
          resolve(data)
          //callback.cognitoCallback(null, null);
          // console.log('Code sent to: ' + data);
          // var verificationCode = prompt('Please input verification code ' ,'');
          // var newPassword = prompt('Enter new password ' ,'');
          // cognitoUser.confirmPassword(verificationCode, newPassword, this);
      }
    });
  });

}

export function resetPassword (userData) {
  const attributeList = []
  let {username, verificationCode, password} = userData
  if(username){
    username = username.toLowerCase()
  }
  let cognitoUserData = {
    Username: username,
    Pool: userPool
  };

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: function (result) {
          resolve(result)
          //callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
          console.log(err);
          return reject(err)
          //callback.cognitoCallback(err.message, null);
      }
    });
  });

}

export function createUser(user) {
  return axios.put('user', user)
    .then(response => {
      store.dispatch({type: 'user/userId', userId: response.data.userId})
      return response;
    });
}

export function getUserByEmail(email, cognitoUser) {
  var accessToken = ""
  if(cognitoUser.signInUserSession){
    accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;
  }
  console.log(accessToken)
  const authString = 'Bearer '.concat(accessToken);
  //sets global header for axios
  axios.defaults.headers.common['Authorization'] = authString
  // axios.defaults.headers.common['CurrentUserId'] = "1"
  if(email){
    email = email.toLowerCase()
  }
  return axios.get('user/findUserByEmail?email='+email)
    .then(response => {
      store.dispatch({type: 'user/userProfile', userProfile: response.data})
      sessionStorage.setItem('userId', response.data.userId);
      sessionStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    });
}

export function getUserById() {
  return axios.get('user/' + sessionStorage.userId)
    .then(response => {
      store.dispatch({type: 'user/userProfile', userProfile: response.data})
      //sessionStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    });
}

export function updateStoreWithCurrentUser(cognitoUser) {
  store.dispatch({type: 'user/user', user: cognitoUser})
}

export function getUserProfilePic(userId, pictureType) {
  return axios.get('user/profilePicture/' + userId + "?UserPictureType=" + pictureType,{responseType: 'arraybuffer'}) // this lets axios know that response type is not JSON but binary data
    .then(response => {
      //let binaryImage = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      //let image = "data:image/png;base64," + image
      let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
      let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
      store.dispatch({type: 'user/userProfilePic', userProfilePic: image})
      return image;
    })
    .catch(response => {
      console.log("User does not have a profile picture yet")
      store.dispatch({type: 'user/userProfilePic', userProfilePic: undefined})
    })
}

export function saveUserProfilePic(data, userId, pictureType, userProfile) {
  //alert(data);
  return axios.post('user/profilePicture', data)
    .then(response => {
      getUserById()
      return response.data
    }).catch(error => {
      throw(error);
    });
}

export function updateUser(formProps) {
  //console.log(formProps)
  return axios.put('user', formProps)
    .then(response => {
      //store.dispatch({type: 'user/userId', userId: response.data.userId})
      // updateUserNotoficationPrefs(formProps.emailPref, formProps.pushPref)
      // .then(response => {
         return response.data;
      // })
    }).catch(error => {
      throw(error);
    });
}

export function deleteUserProfilePic() {
  return axios.delete('user/profilePicture')
    .then(response => {
      return response.data;
    });
}

export function getUserNotoficationPrefs() {
  return axios.get('user/userNotificationPreferences')
    .then(response => {
      store.dispatch({type: 'user/userNotificationPrefs', userNotificationPrefs: response.data})
      return response.data;
    });
}

export function updateUserNotoficationPrefs(emailNotification, pushNotification) {
  if(emailNotification == "" || emailNotification == undefined){
    emailNotification = false
  }
  if(pushNotification == "" || pushNotification == undefined){
    pushNotification = false
  }
  var notificationPrefObj = {email: emailNotification, push: pushNotification};
  //console.log(notificationPrefObj);
  return axios.put('user/userNotificationPreferences', notificationPrefObj)
    .then(response => {
      return response.data;
    }).catch(error => {
      throw(error);
    });
}


export function leaveList(taskListId){
  return axios.delete('user/userLeavesList/'+taskListId)
  .then(response => {
    return response;
  }).catch(error => {
    throw(error);
  });
}

export function findOrgInviteByEmail(email){
  return axios.get('user/findOrgInviteByEmail/', email)
  .then(response => {
    return response.data;
  }).catch(error => {
    throw(error);
  });
}

export function getAllSpecialties() {
  return axios.get('reference/specialties')
    .then(response => {
      store.dispatch({type: 'reference/allSpecialties', allSpecialties: response.data})
      return response.data;
    });
}

export function getAllTitles() {
  return axios.get('reference/titles')
    .then(response => {
      store.dispatch({type: 'reference/allTitles', allTitles: response.data})
      return response.data;
    });
}

export function performHealthCheck() {
  return axios.get('healthcheck/echo')
    .then(response => {
        //console.log("ALL OK")
    }).catch(error => {
      //console.log(error) //Network Error
      //console.log(error.status) //undefined
      //console.log(error.response) //undefined
      if(error.response == undefined || error.response == null){// this means network error
          //console.log("NOT OK")
          throw error;
      }
    });
}

export function refreshAccessToken(email) {
  let cognitoUserData = {
    Username: email,
    Pool: userPool
  };

  var comp = this

  return new Promise((resolve, reject) => {
    var cognitoUser = new CognitoUser(cognitoUserData)
    cognitoUser.getSession(function (err, session) {
      if (err) {
          console.log("Couldn't get the session: " + err, err.stack);
          reject(err);
      }
      else {
          console.log("Session is " + session.isValid());
          //console.log("AccessToken: "+session.accessToken.jwtToken);
          var currentAccessToken = sessionStorage.getItem('accessToken');
          if(currentAccessToken != session.accessToken.jwtToken){
            //call an API to use new access token with axios
            comp.getUserByEmail(email, cognitoUser);
          }
          sessionStorage.setItem('accessToken', session.accessToken.jwtToken);
          resolve(session.isValid())
      }
  })

  })
}