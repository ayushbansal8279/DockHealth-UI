const { I } = inject();

const eml = 'george@dock.health';
const pw = '753951Gb!';

module.exports = {
  fields: {
    usrnm: 'input[name=username]',
    psswrd: 'input[type=password]',
  },

  // Functions
  login() {
    // I.amOnPage('http://localhost:3000/#/login');
    I.amOnPage('/');
    I.waitForText('Welcome to Dock Health');
    I.fillField(this.fields.usrnm, eml);
    I.pressKey('Enter');
    I.fillField(this.fields.psswrd, pw);
    I.pressKey('Enter');
  },
};
