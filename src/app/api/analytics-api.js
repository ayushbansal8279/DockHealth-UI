//Make sure region is 'us-east-1'
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:1327d49a-e925-474f-8b3b-9eb7991a50b4' //Amazon Cognito Identity Pool ID
});

var options = {
    appId : 'a5d34693be2c40449b63a03ca15ba6af', //Amazon Mobile Analytics App ID
    appTitle : 'DockWebApp'     
    // appVersionName : APP_VERSION_NAME, //Optional e.g. '1.4.1'
    // appVersionCode : APP_VERSION_CODE, //Optional e.g. '42'
    // appPackageName : APP_PACKAGE_NAME  //Optional e.g. 'com.amazon.example'
};

var maClient = new AMA.Manager(options);
console.log("mobileAnalyticsClient: "+maClient);

export var mobileAnalyticsClient = maClient
