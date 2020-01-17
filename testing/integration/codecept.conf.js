exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'https://docktest.childrensaccelerator.com',
      // url: 'https://dockdev.childrensaccelerator.com',
      // url: 'https://dockdev-v2.childrensaccelerator.com'
      // url: 'http://localhost:3000/',
      show: true,
      windowSize: '1440x1000',
      waitForNavigation: ['networkidle2', 'domcontentloaded'],
      waitForAction: 1000,
      chrome: {
        args: ['--no-sandbox', '--window-size=1440,1200'],
      },
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
  bootstrap: null,
  mocha: {},
  name: 'integration',
};
