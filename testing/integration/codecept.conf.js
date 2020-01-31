exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {

    /*
    Puppeteer: {
      browser: process.env.BROWSER || 'chrome',
      url: 'https://docktest.childrensaccelerator.com',
      // url: 'https://dockdev.childrensaccelerator.com',
      // url: 'https://dockdev-v2.childrensaccelerator.com'
      // url: 'http://localhost:3000/',
      show: true,
      windowSize: '800x600',
      desiredCapabilities: {
        // close all unexpected popups
        unexpectedAlertBehaviour: 'dismiss',
      },
      waitForNavigation: ['networkidle2', 'domcontentloaded'],
      waitForAction: 1000,
      
      chrome: {
        args: ['--no-sandbox', '--window-size=1440,1200', '--ignore-certificate-errors'],
      },
      firefox: {
        args: ['--ignore-certificate-errors'],
      },
    },
    */

    WebDriver: {
      url: 'https://docktest.childrensaccelerator.com',
      //show: true,
      show: false,
      browser: 'chrome',
      //browser: 'safari',
      //browser: 'firefox,'
      host: '127.0.0.1',
      port: 4444,
      //windowSize: '1200x1000',
      restart: false,
      desiredCapabilities: {
        chromeOptions: {
          //args: [ "--disable-gpu", "--no-sandbox", 'window-size=1440,1200'] // "--window-size=1200,1000", "--headless",
          args: ["--disable-gpu", "--no-sandbox", "--headless", 'window-size=1440,1200']
          //args: ["--disable-gpu", "--no-sandbox", "--headless"]
        }
      }
    },

    
  },
  include: {
    I: './steps_file.js',
    lgnPg: './pages/LoginPage.js',
    tskLstPg: './pages/ListsHome.js',
    inboxPg: './pages/Inbox.js',
    tasksPg: './pages/TaskList.js',
    ptntsPg: './pages/Patients.js',
    onePatientPage: './pages/OnePatient.js',
    peoplePage: './pages/People.js',
    singlePersonPage: './pages/SinglePerson.js',
  },

  plugins: {

    wdio: {
      enabled: true,
      services: ['selenium-standalone']
    }

  },
  

  bootstrap: null,
  mocha: {},
  name: 'integration',
};
