exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'https://dockdev.childrensaccelerator.com',
      // url: 'https://dockdev-v2.childrensaccelerator.com'
      // url: 'http://localhost:3000/',
      show: true,
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
