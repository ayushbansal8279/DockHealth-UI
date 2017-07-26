//Make sure region is 'us-east-1'
AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_COGNITO_IDENTITYPOOLID //Amazon Cognito Identity Pool ID
});

var options = {
    appId :   process.env.AWS_MOBILEANALYTICS_APPID, //Amazon Mobile Analytics App ID
    appTitle : process.env.AWS_MOBILEANALYTICS_APPTITLE
    // appVersionName : APP_VERSION_NAME, //Optional e.g. '1.4.1'
    // appVersionCode : APP_VERSION_CODE, //Optional e.g. '42'
    // appPackageName : APP_PACKAGE_NAME  //Optional e.g. 'com.amazon.example'
};

var maClient = new AMA.Manager(options);
console.log("mobileAnalyticsClient: "+maClient);

export var mobileAnalyticsClient = maClient
