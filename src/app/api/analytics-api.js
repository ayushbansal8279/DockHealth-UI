/*
//Make sure region is 'us-east-1'
AWS.config.region = process.env.REACT_APP_AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITYPOOLID //Amazon Cognito Identity Pool ID
});

var options = {
    appId :   process.env.REACT_APP_AWS_MOBILEANALYTICS_APPID, //Amazon Mobile Analytics App ID
    appTitle : process.env.REACT_APP_AWS_MOBILEANALYTICS_APPTITLE
    // appVersionName : APP_VERSION_NAME, //Optional e.g. '1.4.1'
    // appVersionCode : APP_VERSION_CODE, //Optional e.g. '42'
    // appPackageName : APP_PACKAGE_NAME  //Optional e.g. 'com.amazon.example'
};

var maClient = new AMA.Manager(options);

console.log("mobileAnalyticsClient: "+maClient);

export var mobileAnalyticsClient = maClient
*/

// import Analytics from '@aws-amplify/analytics';
// import Amplify, { Analytics } from 'aws-amplify';

// Amplify.configure({
//     // To get the AWS Credentials, you need to configure
//     // the Auth module with your Cognito Federated Identity Pool
//     Auth: {
//         identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITYPOOLID,
//         region: process.env.REACT_APP_AWS_REGION
//     },
//     Analytics: {
//         AWSPinpoint: {
//             appId: process.env.REACT_APP_AWS_MOBILEANALYTICS_APPID,
//             region: process.env.REACT_APP_AWS_REGION
//         }
//     }
// });

export var mobileAnalyticsClient = {
  recordEvent: (eventName, attributes) => {
    // Analytics.record({
    //     name: eventName,
    //     attributes: attributes
    // });
  },
};
