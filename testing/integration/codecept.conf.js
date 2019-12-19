exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'https://dockdev-v2.childrensaccelerator.com',
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
    ptntPg: './pages/Patients.js',
    // testData: {
    //   eml2: 'gbousvaros2015@gmail.com',
    //   eml: 'george@dock.health',
    //   pw: '753951Gb!',
    // },
  },
  bootstrap: null,
  mocha: {},
  name: 'integration',
};
